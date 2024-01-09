import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getLocalStorage } from '../../utils/localstorage';
import { itemCreated } from '../../redux/item';

function AuthStatus() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const name = useSelector((state: any) => state.authReducer.name);
    const itemCreate = useSelector((state: any) => state.itemReducer.created);

    const token = getLocalStorage('userDetails');

    if (!token) {
        return <p>You are not logged in.</p>;
    }

    const getUser = () => {
        dispatch(itemCreated(true));
    };

    React.useEffect(() => {
        getUser();
    });

    return (
        <p>
            Welcome {name}<br /><br />
            {itemCreate && <>Created Fetched</>}<br />
            <button
                onClick={() => {
                    localStorage.clear();
                    navigate('/');
                }}
            >
                Sign out
            </button>
        </p>
    );
}

export default AuthStatus;