import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TermsFooter } from '../../components/TermsFooter';

export const LoadingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between">
            <main className="flex-1 text-custom-primary-red container flex flex-col items-center justify-center w-full px-3 py-8 md:px-8">	
            
                <FontAwesomeIcon size="2x" icon={faSpinner} spin />

            </main>
            <TermsFooter/>
        </div>
    )
}
