import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const FormButton = ({children, ...props}) => {
	return (
		<button translate='no' className="flex min-w-48 bg-custom-primary-red items center justify-center py-2 px-4 text-white font-medium rounded-xl cursor-pointer active:scale-92 transition disabled:active:scale-100 disabled:opacity-50 disabled:cursor-wait items-center" {...props}>
			<FontAwesomeIcon icon={faSearch} className="mr-2" /> {children}
		</button>
	)
}
