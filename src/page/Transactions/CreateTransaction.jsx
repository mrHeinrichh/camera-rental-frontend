import React, { useState } from 'react'
import {
  useGetCamerasQuery,
  useAddTransactionMutation,
  useGetTransactionsQuery,
} from '@/state/api/reducer'
import { PacmanLoader } from 'react-spinners'
import { ERROR } from '../../constants'
import { CameraLayout } from '@/component'
import CartPreview from '../Transactions/CartPreview'
import Navbar from '../../component/Navbar'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function () {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCamerasQuery()

  const { refetch: refetchTransactions } = useGetTransactionsQuery()

  const [cartItems, setCartItems] = useState([])

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)

  const [transactionDate, setTransactionDate] = useState(new Date())

  const [addTransaction] = useAddTransactionMutation()

  const auth = useSelector((state) => state.auth)

  const [cartCount, setCartCount] = useState(0)

  const handleOnAddToCart = (item) => {
    if (!cartItems.some((cartItem) => cartItem._id === item._id)) {
      setCartItems([...cartItems, item])
      setCartCount(cartCount + 1) // Add this line
    }
  }

  const handleOnRemoveFromCart = (itemToRemove) => {
    const newCartItems = cartItems.filter((cartItem, index) => {
      return (
        cartItem._id === itemToRemove._id &&
        cartItems.indexOf(cartItem) !== index
      )
    })
    setCartItems(newCartItems)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmPurchase = async () => {
    try {
      const newTransaction = await addTransaction({
        user: auth.user._id,
        cameras: cartItems.map((item) => item._id),
        status: 'pending',
        date: transactionDate,
      })

      // Generate the PDF receipt
      const doc = new jsPDF()
      doc.text('Transaction Details:', 10, 10)
      doc.text('Date: ' + newTransaction.date, 10, 20)
      doc.text('User: ' + auth.user.name, 10, 30)
      doc.text('Items: ', 10, 40)
      let itemY = 50
      newTransaction.cameras.forEach((camera) => {
        const item = cartItems.find((item) => item._id === camera)
        doc.text(`${item.name} - ${item.price}`, 10, itemY)
        itemY += 10
      })

      // Download the PDF
      doc.save('transaction.pdf')

      navigate('/dashboard/comment/create')
      setCartItems([])
      handleClose()
    } catch (err) {
      setError(true)
      console.error(err)
    }
  }

  return (
    <>
      <Navbar
        cartItems={cartItems}
        onRemoveFromCart={handleOnRemoveFromCart}
        onAddToCart={handleOnAddToCart}
        cartCount={cartCount}
      />

      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <>
          <CameraLayout
            data={data?.details}
            onAddToCart={handleOnAddToCart}
            cartItems={cartItems}
          />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to purchase the selected items
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleConfirmPurchase}>Confirm</Button>
            </DialogActions>
          </Dialog>
          {error && (
            <div className="errorMessage">
              An error occurred while processing your purchase.
            </div>
          )}
        </>
      )}
    </>
  )
}
