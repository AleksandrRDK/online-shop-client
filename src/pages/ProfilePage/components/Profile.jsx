import defaultAvatar from '@/assets/default-avatar.png';

function Profile({ user, setIsOpen }) {
    return (
        <div className="profile__wrapper">
            <div className="profile__avatar">
                <img src={user.avatar || defaultAvatar} alt="avatar" />
            </div>
            <span className="profile__devider" />
            <div className="profile__cred">
                <div className="profile__name">{user.username}</div>
                <div className="profile__email">{user.email}</div>
            </div>
            <button
                className="profile__settings"
                onClick={() => setIsOpen(true)}
            >
                ⚙️
            </button>
        </div>
    );
}

export default Profile;
