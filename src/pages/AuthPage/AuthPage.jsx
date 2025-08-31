import AuthModal from './components/AuthModal/AuthModal';

const AuthPage = () => {
    return (
        <div className="auth-page">
            <AuthModal isOpen={true} onClose={() => {}} />
        </div>
    );
};

export default AuthPage;
