import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetCameraByIdQuery } from '@/state/api/reducer'
import { Card, CardContent, Typography } from '@mui/material'
import { ERROR } from '../../constants'
import { PacmanLoader } from 'react-spinners'

export default function () {
  const { id } = useParams()
  const { data, isLoading, isError } = useGetCameraByIdQuery(id, {
    populate: 'user',
  })

  const { name, text, price, image } = data?.details ?? {}

  return (
    <>
      {isLoading ? (
        <div className="loader">
          <PacmanLoader color="#2c3e50" loading={true} size={50} />
        </div>
      ) : isError ? (
        <div className="errorMessage">{ERROR.GET_CAMERAS_ERROR}</div>
      ) : (
        <Card
          sx={{
            margin: 'auto',
            width: '50%',
            textAlign: 'center',
            backgroundColor: '#2c3e50',
            color: '#f1f2f6',
            borderRadius: '.75rem',
          }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Camera Details
            </Typography>
            <Typography sx={{ mb: 1.5 }}>ID: {id}</Typography>
            {image?.map((image) => (
              <img
                style={{ padding: '0 .5rem' }}
                height={150}
                width={150}
                src={image.url}
                alt={image.originalname}
                key={image.public_id}
              />
            ))}
            <Typography variant="body2">
              <strong>Name:</strong> {name}
            </Typography>
            <Typography variant="body2">
              <strong>Text:</strong> {text}
            </Typography>
            <Typography variant="body2">
              <strong>Price:</strong> {price}
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  )
}
