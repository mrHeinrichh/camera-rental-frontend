import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Box } from '@mui/system'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import RegisterImg from '@/assets/camera-register.jpg'
import { useAddUserMutation } from '@/state/api/reducer'
import { useFormik } from 'formik'
import { createUserValidation } from '../../validation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ROLES } from '../../constants'
import { PacmanLoader } from 'react-spinners'
import { ImagePreview } from '@/component'

export default function () {
  const fileInputRef = useRef()
  const navigate = useNavigate()
  const [addUser, isLoading] = useAddUserMutation()
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
            navigate('/login')
            toast.success('Registered successfully!', toastProps)
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

  const handleLogin = () => {
    navigate(`/login`)
  }

  return (
    <>
      {!isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : (
        <>
          <Container sx={{ mt: 7.5, mb: 5 }} disableGutters>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Box sx={{ width: '60%', height: '100%', paddingRight: '2rem' }}>
                <img
                  src={RegisterImg}
                  alt="RegisterImg"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '.5rem',
                  }}
                />
              </Box>
              <Box sx={{ width: '40%', height: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Sign Up
                </Typography>
                <Typography variant="h5" align="center">
                  Get us some of your information to get a free access to our
                  website.
                </Typography>
                <form sx={{ height: '100%' }} onSubmit={formik.handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                  <TextField
                    margin="normal"
                    select
                    required
                    id="roles"
                    name="roles"
                    label="Select roles"
                    fullWidth
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
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    required
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!formik.isValid}
                  >
                    {
                      <span
                        style={{
                          fontSize: '1.15rem',
                        }}
                      >
                        Sign Up
                      </span>
                    }
                  </Button>
                </form>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    sx={{
                      mt: 1,
                    }}
                  >
                    Already Have An Account?
                  </Typography>
                  <Button
                    type="button"
                    onClick={handleLogin}
                    variant="text"
                    color="secondary"
                    sx={{ ml: 2 }}
                  >
                    {
                      <span
                        style={{
                          textTransform: 'capitalize',
                          fontSize: '1.2rem',
                        }}
                      >
                        Sign In Here
                      </span>
                    }
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </>
  )
}
