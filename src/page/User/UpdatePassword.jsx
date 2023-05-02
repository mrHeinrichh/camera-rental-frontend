import { useState } from 'react'
import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useUpdatePasswordMutation } from '../../state/api/reducer'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { updatePasswordValidation } from '../../validation'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'

export default function () {
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [updatePassword, { isLoading, isError }] = useUpdatePasswordMutation()

  const auth = useSelector((state) => state.auth)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: updatePasswordValidation,
    onSubmit: (values) => {
      const { oldPassword, newPassword, confirmPassword } = values
      updatePassword({
        id: auth?.user?._id,
        oldPassword,
        newPassword,
        confirmPassword,
      })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            navigate('/dashboard')
            toast.success('Password updated successfully!', toastProps)
          } else {
            toast.error('Error while editing password.', toastProps)
          }
        })
        .catch((error) => {
          toast.error('Error while editing password.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.USERS_PASSWORD_ERROR}</div>
      ) : (
        <>
          <Container maxWidth="sm">
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h4" gutterBottom>
                Update Password
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  label="Old Password"
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={formik.values.oldPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="oldPassword"
                  error={
                    formik.touched.oldPassword &&
                    Boolean(formik.errors.oldPassword)
                  }
                  helperText={
                    formik.touched.oldPassword && formik.errors.oldPassword
                  }
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowOldPassword}>
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="newPassword"
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                  margin="normal"
                  required
                  fullWidth
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
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="confirmPassword"
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={!formik.isValid}
                >
                  Update Password
                </Button>
              </form>
            </Box>
          </Container>
        </>
      )}
    </>
  )
}
