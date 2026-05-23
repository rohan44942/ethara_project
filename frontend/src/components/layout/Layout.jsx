import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toast from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import { useGetCurrentUserQuery } from '../../store/api/apiSlice';
import { setCredentials, updateUser, selectCurrentUser, selectAuthToken } from '../../store/slices/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const currentUser = useSelector(selectCurrentUser);
  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data?.data?.user) {
      if (!currentUser) {
        dispatch(setCredentials({ user: data.data.user, token }));
      } else {
        dispatch(updateUser(data.data.user));
      }
    }
  }, [data, currentUser, dispatch, token]);

  if (isLoading && !currentUser) {
    return <LoadingSpinner fullScreen />;
  }

  if (isError && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-center text-gray-700">Unable to load your profile. Please refresh or login again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Global components */}
      <Toast />
      <ConfirmDialog />
    </div>
  );
};

export default Layout;
