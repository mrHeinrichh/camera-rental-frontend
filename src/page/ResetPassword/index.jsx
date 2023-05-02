import { useState } from 'react'
import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useResetPasswordMutation } from '../../state/api/reducer'
import { Box } from '@mui/system'
import { useFormik } from 'formik'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { resetPasswordValidation } from '../../validation'
import { PacmanLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { TAGS } from '../../constants'

export default function () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordValidation,
    onSubmit: (values) => {
      const { newPassword, confirmPassword } = values
      const email = new URLSearchParams(window.location.search).get(TAGS.EMAIL)
      resetPassword({
        newPassword,
        confirmPassword,
        email,
      })
        .then((response) => {
          const toastProps = {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }
          if (response?.data?.success === true) {
            window.open(
              `https://mailtrap.io/inboxes/1656145/messages`,
              '_blank',
            )
            toast.success('Emailed Reset Password successfully!', toastProps)
          } else {
            toast.error("Email wasn't sent to the user.", toastProps)
          }
        })
        .catch((error) => {
          toast.error("Email wasn't sent to the user.", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          })
        })
    },
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
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
                Reset Password
              </Typography>
              <form onSubmit={formik.handleSubmit}>
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
                  Reset Password
                </Button>
              </form>
            </Box>
          </Container>
        </>
      )}
    </>
  )
}
