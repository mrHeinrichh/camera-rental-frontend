import { useRef, useState } from 'react'
import {
  TextField,
  Typography,
  Grid,
  Button,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useAddUserMutation } from '@/state/api/reducer'
import { useFormik } from 'formik'
import { createUserValidation } from '../../validation'
import { useNavigate } from 'react-router-dom'
import { ROLES, ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { ImagePreview } from '@/component'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function () {
  const fileInputRef = useRef()
  const navigate = useNavigate()
  const [addUser, isLoading, isError] = useAddUserMutation()
  const [showPassword, setShowPassword] = useState(false)
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      roles: [],
      image: [],
    },
    validationSchema: createUserValidation,
    onSubmit: async (values) => {
      const formData = new FormData()

      formData.append('name', values.name)
      formData.append('email', values.email)
      formData.append('password', values.password)
      values.roles.forEach((role) => formData.append('roles[]', role))
      Array.from(values.image).forEach((file) => {
        formData.append('image', file)
      })

      addUser(formData)
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard/user')
            toast.success('User created successfully!', toastProps)
          } else {
            toast.error('Error while creating user.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while creating user.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleRoleChange = (value) => {
    let values = Array.isArray(value) ? value : [value]
    if (
      values.includes('Customer') &&
      (values.includes('Admin') || values.includes('Employee'))
    ) {
      values = values.filter((role) => role !== 'Customer')
    }
    formik.setFieldValue('roles', values)
  }

  return (
    <>
      {!isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_USERS_ERROR}</div>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Create User
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
                  required
                  id="password"
                  name="password"
                  label="Password"
                  fullWidth
                  autoComplete="password"
                  variant="standard"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  id="roles"
                  name="roles"
                  label="Select roles"
                  fullWidth
                  variant="standard"
                  value={formik.values.roles}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  error={formik.touched.roles && Boolean(formik.errors.roles)}
                  helperText={formik.touched.roles && formik.errors.roles}
                  SelectProps={{
                    multiple: true,
                  }}
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="image"
                  name="image"
                  type="file"
                  ref={fileInputRef}
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
                {formik.values.image && (
                  <ImagePreview images={Array.from(formik.values.image)} />
                )}
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
