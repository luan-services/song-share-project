import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export const DownloadButton = ({...props}) => {
    return (
        <button className="flex bg-custom-primary-red justify-center py-2 px-4 text-white text-sm font-medium rounded-xl cursor-pointer active:scale-92 transition disabled:active:scale-100 disabled:opacity-50 disabled:cursor-wait items-center" {...props}>
            <FontAwesomeIcon icon={faDownload} className="mr-1" /> Download
        </button>
    )
}
