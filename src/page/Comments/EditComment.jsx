import React from 'react'
import { TextField, Typography, Grid, Button, Rating } from '@mui/material'
import {
  useUpdateCommentMutation,
  useGetCommentByIdQuery,
} from '@/state/api/reducer'
import { useFormik } from 'formik'
import { editCommentValidation } from '../../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const navigate = useNavigate()

  const { id } = useParams()

  const { data, isLoading, isError } = useGetCommentByIdQuery(id)

  const [updateComment] = useUpdateCommentMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      transService: data?.details?.transService || '',
      text: data?.details?.text || '',
      ratings: data?.details?.ratings || 1,
    },
    validationSchema: editCommentValidation,
    onSubmit: (values) => {
      updateComment({
        id: data?.details?._id,
        payload: values,
      })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/comment')
            toast.success('Comment edited successfully!', toastProps)
          } else {
            toast.error('Error while editing comment.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while editing comment.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_COMMENTS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Comment
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
              <Grid item xs={12}>
                <Rating
                  name="ratings"
                  value={formik.values.ratings}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('ratings', newValue)
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
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
