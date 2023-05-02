import { useState } from 'react'
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useLoginMutation } from '../../state/api/reducer'
import { Box } from '@mui/system'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import loginImg from '@/assets/camera-login.jpg'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
import { PacmanLoader } from 'react-spinners'
import { loginUserValidation } from '../../validation'

export default function () {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginUser, { isLoading }] = useLoginMutation()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginUserValidation,
    onSubmit: (values) => {
      loginUser(values)
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard')
            toast.success('Login successful!ly!', toastProps)
          } else {
            toast.error('Login failed. Please try again.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Login failed. Please try again.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = () => {
    navigate(`/Forgotpassword`)
  }

  const handleRegister = () => {
    navigate(`/register`)
  }

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : (
        <>
          <Container
            sx={{
              mt: 5,
              mb: 5,
              display: 'grid',
              justifyContent: 'center',
              alignItems: 'center',
              height: '90vh',
            }}
            disableGutters
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box sx={{ width: '60%' }}>
                <img
                  src={loginImg}
                  alt="loginImg"
                  style={{ width: '100%', borderRadius: '.5rem' }}
                />
              </Box>
              <Box sx={{ width: '50%' }} align="center">
                <Typography variant="h4" gutterBottom>
                  Sign in to your account
                </Typography>
                <Box
                  component="form"
                  onSubmit={formik.handleSubmit}
                  sx={{
                    mt: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '400px',
                    width: '100%',
                  }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    margin="normal"
                    id="password"
                    name="password"
                    label="Password"
                    required
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="secret password"
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 2,
                      width: '100%',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                      }
                      label="Remember me"
                      labelPlacement="end"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Button
                      type="button"
                      onClick={handleForgotPassword}
                      variant="text"
                      color="error"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {
                        <span
                          style={{
                            textTransform: 'capitalize',
                            fontSize: '1.15rem',
                            marginBottom: '.25rem',
                          }}
                        >
                          Forgot Password
                        </span>
                      }
                    </Button>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    {
                      <span
                        style={{
                          textTransform: 'capitalize',
                          fontSize: '1.15rem',
                        }}
                      >
                        Log In
                      </span>
                    }
                  </Button>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 3,
                      width: '100%',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Not a member
                    </Typography>

                    <Button
                      type="button"
                      onClick={handleRegister}
                      variant="text"
                      color="success"
                    >
                      {
                        <span
                          style={{
                            textTransform: 'capitalize',
                            fontSize: '1.15rem',
                            marginBottom: '.25rem',
                          }}
                        >
                          Register Here
                        </span>
                      }
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </>
  )
}
