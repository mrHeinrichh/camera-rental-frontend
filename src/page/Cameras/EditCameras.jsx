import { useRef } from 'react'
import {
  TextField,
  Typography,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  useUpdateCameraMutation,
  useGetCameraByIdQuery,
  useGetUsersQuery,
} from '@/state/api/reducer'
import { useFormik } from 'formik'
import { editCameraValidation } from '../../validation'
import { useNavigate, useParams } from 'react-router-dom'
import { USER, ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const fileInputRef = useRef()

  const navigate = useNavigate()

  const { id } = useParams()

  const { data, isLoading, isError } = useGetCameraByIdQuery(id)

  const { data: getAllCamera } = useGetUsersQuery()
  const users = getAllCamera?.details ?? []
  const admins = users?.filter((user) => user?.roles?.includes(USER.ADMIN))
  const associatedUser = users?.find(
    (user) => user?._id === data?.details?.user?._id,
  )

  const [updateCamera] = useUpdateCameraMutation()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.details?.name || '',
      text: data?.details?.text || '',
      price: data?.details?.price || '',
      image: data?.details?.image || [],
      user: associatedUser?._id || '',
    },
    validationSchema: editCameraValidation,
    onSubmit: (values) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('text', values.text)
      formData.append('price', values.price)
      formData.append('user', values.user)
      Array.from(values.image).forEach((file) => {
        formData.append('image', file)
      })
      updateCamera({ id: data?.details?._id, payload: formData })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/camera')
            toast.success('Camera edited successfully!', toastProps)
          } else {
            toast.error('Error while editing camera.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while editing camera.', {
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
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Edit Camera
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
              <Grid item xs={12}>
                <TextField
                  required
                  id="price"
                  name="price"
                  label="Price"
                  fullWidth
                  autoComplete="price"
                  variant="standard"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="user-label">Select User</InputLabel>
                <Select
                  labelId="user-label"
                  id="user"
                  name="user"
                  fullWidth
                  value={formik.values.user}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.user && Boolean(formik.errors.user)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Please select an owner
                  </MenuItem>
                  {Array.isArray(admins) &&
                    admins.map((user) => {
                      return (
                        <MenuItem key={user._id} value={user._id}>
                          {user.name}
                        </MenuItem>
                      )
                    })}
                </Select>
                {formik.touched.user && formik.errors.user && (
                  <Typography variant="caption" color="error">
                    {formik.errors.user}
                  </Typography>
                )}
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
