import "./ActiveFriends.scss";
import {
    SearchIcon,

} from "../../../../components/assetsConvert.js";

function ActiveFriends({ activeFriends }) {
    const friends = Array.isArray(activeFriends) ? activeFriends : [];

    return (
        <div className="active-friends">
            <div className="active-friends__content">
                <div className="active-friends__top">
                    <div className="active-friends__title">
                        <p>Bạn bè đang hoạt động</p>
                    </div>

                    <div className="active-friends__search">
                        <SearchIcon />
                    </div>
                </div>
                
                <div className="active-friends__friends">
                    {
                        friends.map((activeFriend, index) => (
                            <div className="active-friends__info" key={index}>
                                <div className="active-friends__img--icon">
                                    <img src={activeFriend.avatarUrl} />
                                </div>

                                <div className="active-friends__name">
                                    <p>{activeFriend.fullName}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ActiveFriends;