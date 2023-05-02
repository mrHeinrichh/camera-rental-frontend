import { useRef } from 'react'
import { TextField, Typography, Grid, Button } from '@mui/material'
import { useUpdateUserMutation, useGetUserByIdQuery } from '@/state/api/reducer'
import { useFormik } from 'formik'
import { editUserValidation } from '../../validation'
import { useNavigate } from 'react-router-dom'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'

export default function () {
  const fileInputRef = useRef()
  const navigate = useNavigate()

  const auth = useSelector((state) => state.auth)

  const { data, isLoading, isError } = useGetUserByIdQuery(auth?.user?._id)

  const [updateUser] = useUpdateUserMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.details?.name || '',
      email: data?.details?.email || '',
      image: data?.details?.image || [],
    },
    validationSchema: editUserValidation,
    onSubmit: async (values) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      Array.from(values.image).forEach((file) => {
        formData.append('image', file)
      })

      updateUser({ id: data?.details?._id, payload: formData })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard')
            toast.success('User updated successfully!', toastProps)
          } else {
            toast.error('Error while editing user.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while editing user.', {
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
        <div className="errorMessage">{ERROR.USER_DETAILS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  fullWidth
                  autoComplete="name"
                  variant="standard"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="email"
                  name="email"
                  label="Email"
                  fullWidth
                  autoComplete="email"
                  variant="standard"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="image"
                  name="image"
                  type="file"
                  ref={fileInputRef}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  accept="image/*"
                  onChange={(event) =>
                    formik.setFieldValue('image', event.currentTarget.files)
                  }
                  inputProps={{
                    multiple: true,
                  }}
                />
                {data.details.image.map((image) => (
                  <span key={image.public_id}>
                    <img
                      height={60}
                      width={75}
                      src={image.url}
                      alt={image.originalname}
                    />
                  </span>
                ))}
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!formik.isValid}
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </>
  )
}
