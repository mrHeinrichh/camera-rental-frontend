import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

export default function ({ cartItems, onRemoveFromCart, onConfirmPurchase }) {
  const [modalOpen, setModalOpen] = useState(false)

  const handleConfirmPurchase = () => {
    onConfirmPurchase()
    setModalOpen(false)
  }

  return (
    <div className="cartPreview">
      <h3>Cart Preview</h3>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item._id} className="cartItem">
            <span>{item.name}</span>
            <span>{item.price}</span>
            <button onClick={() => onRemoveFromCart(item)}>Remove</button>
          </div>
        ))
      ) : (
        <div>No items in cart</div>
      )}
      {cartItems && cartItems.length > 0 ? (
        <button onClick={() => setModalOpen(true)}>Confirm Purchase</button>
      ) : null}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to purchase the selected items?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmPurchase}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
