// import Next
import { NextPage } from 'next'
import { ReactNode } from 'react';

// ** Views Imports
import LayoutClient from 'src/views/layouts/LayoutClient';
import MyProfilePage from 'src/views/pages/my-profile';

type TProps = {

}

const MyProfile:NextPage<TProps> = () => {
    return <MyProfilePage />
}

export default MyProfile;
MyProfile.getLayout = (page: ReactNode) => <LayoutClient>{page}</LayoutClient>


