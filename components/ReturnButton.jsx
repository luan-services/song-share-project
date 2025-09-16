import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const ReturnButton = ({...props}) => {
	return (
        <button className="flex bg-custom-primary-red justify-center py-3 px-6 text-white text-sm font-black rounded-lg cursor-pointer active:scale-92 transition items-center" {...props}>
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
	)
}
