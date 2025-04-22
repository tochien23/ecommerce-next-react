// import Next
import { NextPage } from 'next'
import { ReactNode } from 'react';

// ** Views Imports
import LayoutClient from 'src/views/layouts/LayoutClient';
import ChangePasswordPage from 'src/views/pages/change-password';

type TProps = {

}

const ChangePassword:NextPage<TProps> = () => {
    return <ChangePasswordPage />
}

export default ChangePassword;
ChangePassword.getLayout = (page: ReactNode) => <LayoutClient>{page}</LayoutClient>


