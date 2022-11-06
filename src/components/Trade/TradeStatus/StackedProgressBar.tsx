import { FC } from "react";
import 'assets/css/ProgressBar.scss'
import { HStack, Flex } from "@chakra-ui/react";


export const StackedProgressBar: FC<{ step: number }> = ({ step = 0 }) => {
    return (
        <HStack spacing={0} textColor='white' textAlign='center'>
            <div className={`progress ${step >= 1 ? step === 1 ? 'progress-striped active' : '' : 'inactive'}`} style={{ width: '100%' }}>
                { // eslint-disable-next-line jsx-a11y/aria-role
                }
                <div role="progressbar" style={{ width: '100%', height: '50px' }} className={`progress-bar ${step > 1 ? 'progress-bar-success' : 'progress-bar-warning'}`}>
                    <Flex alignItems='center' justifyContent='center' height='100%' >Deposit Recieved</Flex>
                </div>
            </div>
            <div className={`progress ${step >= 2 ? step === 2 ? 'progress-striped active' : '' : 'inactive'}`} style={{ width: '100%' }}>
                { // eslint-disable-next-line jsx-a11y/aria-role
                }
                <div role="progressbar" style={{ width: '100%', height: '50px' }} className={`progress-bar ${step > 2 ? 'progress-bar-success' : 'progress-bar-warning'}`}>
                    <Flex alignItems='center' justifyContent='center' height='100%' >Awaiting Exchange</Flex>
                </div>
            </div>
            <div className={`progress ${step >= 3 ? step === 3 ? 'progress-striped active' : '' : 'inactive'}`} style={{ width: '100%' }}>
                { // eslint-disable-next-line jsx-a11y/aria-role
                }
                <div role="progressbar" style={{ width: '100%', height: '50px' }} className={`progress-bar ${step > 3 ? 'progress-bar-success' : 'progress-bar-warning'}`}>
                    <Flex alignItems='center' justifyContent='center' height='100%' >Complete</Flex>
                </div>
            </div>
        </HStack>
    )
}