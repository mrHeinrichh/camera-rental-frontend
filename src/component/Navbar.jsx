import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from './Appbar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import PasswordIcon from '@mui/icons-material/Password'
import InfoIcon from '@mui/icons-material/Info'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import Badge from '@mui/material/Badge'
import { useDispatch } from 'react-redux'
import { logout } from '@/state/auth/authReducer'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useSelector } from 'react-redux'
import { Avatar } from '@mui/material'
import CartPreview from '../page/Transactions/CartPreview'
import Dialog from '@mui/material/Dialog'
import jsPDF from 'jspdf'
import {
  useGetCamerasQuery,
  useAddTransactionMutation,
  useGetTransactionsQuery,
} from '@/state/api/reducer'

export default function (props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addTransaction] = useAddTransactionMutation()

  const { cartItems, onRemoveFromCart, onConfirmPurchase, onAddToCart } = props
  const [transactionDate, setTransactionDate] = useState(new Date())

  const [cartPreviewOpen, setCartPreviewOpen] = useState(false)

  const toggleCartPreview = () => {
    setCartPreviewOpen(!cartPreviewOpen)
  }

  const auth = useSelector((state) => state.auth)
  const { open, toggleDrawer } = props

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedButton] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [error, setError] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(logout())
      navigate('/login')
      toast.success('Logout successful!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    } catch (error) {
      console.error(error)
      toast.error('Logout failed. Please try again.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
    }
  }

  const handleUpdateUserDetails = async () => {
    navigate(`userDetails/${auth.user._id}`)
  }

  const handleUpdatePassword = async () => {
    navigate(`updatePassword/${auth.user._id}`)
  }
  const [cartItemsState, setCartItems] = useState([])

  const handleAddToCart = () => {
    setCartCount(cartCount + 1)
    onAddToCart()
  }

  const handleOnAddToCart = (item) => {
    if (!cartItemsState.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItemsState, item])
      setCartCount(cartCount + 1) // update cartCount state variable
    }
  }

  const handleConfirmPurchase = async () => {
    try {
      const newTransaction = await addTransaction({
        user: auth.user._id,
        cameras: cartItems.map((item) => item._id),
        status: 'pending',
        date: transactionDate,
      })

      // Create a new instance of jsPDF
      const doc = new jsPDF()

      // Add content to the PDF
      doc.text('Transaction Receipt', 10, 10)
      doc.text(`Transaction ID: ${newTransaction._id}`, 10, 20)
      doc.text(`Date: ${newTransaction.date}`, 10, 30)
      doc.text('Items:', 10, 40)
      cartItems.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.name} - ${item.price}`,
          10,
          50 + index * 10,
        )
      })

      // Save the PDF
      doc.save('transaction-receipt.pdf')

      navigate('/dashboard/comment/create')
      setCartItems([])
      handleClose()
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }

  const randomIndex =
    auth?.user?.image && auth?.user?.image.length
      ? Math.floor(Math.random() * auth.user.image.length)
      : null

  return (
    <>
      <AppBar
        position="absolute"
        open={open}
        sx={{ backgroundColor: '#2c3e50' }}
      >
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
              '&:hover': {
                backgroundColor: '#f1f2f6',
                color: '#2c3e50',
                transition: 'transform 0.2s ease-in-out',
                transform: 'scale(1.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          {auth?.user?.roles?.includes('Admin') ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>
          ) : auth?.user?.roles?.includes('Employee') ? (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Employee Dashboard
            </Typography>
          ) : (
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Customer Dashboard
            </Typography>
          )}

          {auth?.user?.roles?.includes('Customer') ? (
            <IconButton
              onClick={toggleCartPreview}
              color="inherit"
              style={{ color: 'white' }}
            >
              <Badge badgeContent={props.cartCount}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          ) : null}

          <Dialog open={cartPreviewOpen} onClose={toggleCartPreview}>
            <CartPreview
              cartItems={cartItems}
              onRemoveFromCart={onRemoveFromCart}
            />
          </Dialog>

          <Dialog open={cartPreviewOpen} onClose={toggleCartPreview}>
            <CartPreview
              cartItems={cartItems}
              onRemoveFromCart={onRemoveFromCart}
              onConfirmPurchase={handleConfirmPurchase}
            />
          </Dialog>
          <Button
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              borderRadius: '0.5rem',
              backgroundColor: '#f1f2f6',
              color: '#2c3e50',
              '&:hover': {
                backgroundColor: '#f1f2f6',
                color: '#2c3e50',
              },
            }}
          >
            {selectedButton || (
              <>
                <Avatar
                  alt={auth?.user?.image?.originalname}
                  src={
                    auth?.user?.image && auth?.user?.image?.length
                      ? auth?.user?.image[randomIndex]?.url
                      : null
                  }
                  key={auth?.user?.image?.public_id}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                Welcome, {auth?.user?.name}
              </>
            )}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          ></Menu>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleUpdateUserDetails}>
              <IconButton
                color="inherit"
                aria-label="updateUserDetails"
                sx={{
                  borderRadius: '0.5rem',
                  '&:hover': {
                    backgroundColor: '#f1f2f6',
                    color: '#2c3e50',
                    transition: 'transform 0.2s ease-in-out',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Typography variant="button" sx={{ marginLeft: 1 }}>
                  Update Your Details
                </Typography>
                <InfoIcon sx={{ ml: 1 }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleUpdatePassword}>
              <IconButton
                color="inherit"
                aria-label="updatePassword"
                sx={{
                  borderRadius: '0.5rem',
                  '&:hover': {
                    backgroundColor: '#f1f2f6',
                    color: '#2c3e50',
                    transition: 'transform 0.2s ease-in-out',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Typography variant="button" sx={{ marginLeft: 1 }}>
                  Update Password
                </Typography>
                <PasswordIcon sx={{ ml: 1 }} />
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <IconButton
                color="inherit"
                aria-label="logout"
                sx={{
                  borderRadius: '0.5rem',
                  '&:hover': {
                    backgroundColor: '#f1f2f6',
                    color: '#2c3e50',
                    transition: 'transform 0.2s ease-in-out',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Typography variant="button" sx={{ marginLeft: 1 }}>
                  Logout
                </Typography>
                <ExitToAppIcon sx={{ ml: 1 }} />
              </IconButton>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </>
  )
}
