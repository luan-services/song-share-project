import React from 'react'

export const FormButton = ({children, ...props}) => {
	return (
		<button className="flex min-w-48 bg-custom-primary-red justify-center py-2 px-4 text-white font-medium rounded-xl cursor-pointer active:scale-92 transition disabled:active:scale-100 disabled:opacity-50 disabled:cursor-wait items-center" {...props}>
			{children}
		</button>
	)
}
