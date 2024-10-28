import { useEffect } from 'react';

function GoogleLogin() {

    const google = (window as any).google;

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: 'YOUR_CLIENT_ID',
            callback: handleGoogleSignIn
        });

        google.accounts.id.renderButton(
            document.getElementById('buttonDiv'),
            { theme: "outline", size: "large" }
        );
    }, []);

    const handleGoogleSignIn = (response) => {
        console.log(response.credential);
    };

    return (
        <div>
            {/* Nút Google Sign-In sẽ được render vào phần tử này */}
            <div id="buttonDiv"></div>
        </div>
    );
}

export default GoogleLogin;
