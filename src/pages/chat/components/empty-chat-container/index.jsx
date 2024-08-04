import Lottie from 'react-lottie'
import { animationDefaultOptions } from '@/lib/utils'
const EmptyChatContainer = () => {
    return (
        <div className='flex-1 md:bg-light-background/10 md:dark:bg-dark-background md:flex hidden flex-col justify-center items-center duration-1000 transition-all'>
            <Lottie
                isClickToPauseDisabled={true}
                height={300}
                width={300}
                options={animationDefaultOptions} />
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
                <h3 className='poppins-medium text-light-foreground dark:text-dark-foreground'>
                    Hi <span className='text-purple-500'>!</span> Welcome to <span className='text-purple-500'>TS</span> Chat App<span className='text-purple-500'>.</span>
                </h3>
            </div>
        </div>
    )
}

export default EmptyChatContainer