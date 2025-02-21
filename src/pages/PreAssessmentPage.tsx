import React from 'react'
import { useParams } from 'react-router-dom'

const PreAssessmentPage = () => {

    const { id } = useParams();

  return (
    <div>
        ID : {id}
    </div>
  )
}

export default PreAssessmentPage