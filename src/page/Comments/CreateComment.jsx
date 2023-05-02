import React from 'react'
import { TextField, Typography, Grid, Button, Rating } from '@mui/material'
import {
  useAddCommentMutation,
  useGetTransactionsQuery,
} from '@/state/api/reducer'
import { useFormik } from 'formik'
import { createCommentValidation } from '../../validation'
import { useNavigate } from 'react-router-dom'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const navigate = useNavigate()
  const [addComment, isLoading, isError] = useAddCommentMutation()

  const {
    data: transactions,
    isLoading: transactionsLoading,
  } = useGetTransactionsQuery()

  const lastTransactionId =
    transactions?.details?.[transactions.details.length - 1]?._id

  const formik = useFormik({
    initialValues: {
      transService: '',
      text: '',
      ratings: 0,
    },
    validationSchema: createCommentValidation,
    onSubmit: (values) => {
      const newComment = {
        ...values,
        transaction: lastTransactionId,
      }
      addComment(newComment)
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/comment')
            toast.success('Comment created successfully!', toastProps)
          } else {
            toast.error('Error while creating comment.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while creating comment.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  return (
    <>
      {!isLoading || transactionsLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Create Comment
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="transService"
                  name="transService"
                  label="TransService"
                  fullWidth
                  autoComplete="transService"
                  variant="standard"
                  value={formik.values.transService}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.transService &&
                    Boolean(formik.errors.transService)
                  }
                  helperText={
                    formik.touched.transService && formik.errors.transService
                  }
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="text"
                  name="text"
                  label="Text"
                  fullWidth
                  autoComplete="text"
                  variant="standard"
                  value={formik.values.text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.text && Boolean(formik.errors.text)}
                  helperText={formik.touched.text && formik.errors.text}
                />
              </Grid>
              <Rating
                name="ratings"
                value={Number(formik.values.ratings) || 0}
                onChange={(event, newValue) => {
                  formik.setFieldValue('ratings', Number(newValue))
                }}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid}
              sx={{ mt: '1rem' }}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  )
}
