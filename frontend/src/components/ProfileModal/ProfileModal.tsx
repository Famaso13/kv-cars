import Button from "../Button/Button";
import "./profileModal.scss";
import profile from "../../assets/profile.png";

interface ModalProps {
    setModal: (value: boolean) => void;
}

const ProfileModal: React.FC<ModalProps> = ({ setModal }) => {
    return (
        <>
            <div className="modal-background" onClick={() => setModal(false)}></div>
            <div className="modal">
                <div>
                    <p onClick={() => setModal(false)}>X</p>
                </div>
                <h1>Change your profile picture</h1>
                <img src={profile} alt="todo change with backed" />
                <input id="fileInput" type="file" style={{ display: "none" }} />
                <Button
                    label="Upload new picture"
                    onClick={() => {
                        const fileInput = document.getElementById("fileInput");
                        if (fileInput) {
                            fileInput.click();
                        }
                        // TODO add upload logic
                    }}
                    style="secondary"
                    width={"40%"}
                    height={"70px"}
                />
                <div className="modal-space"></div>
            </div>
        </>
    );
};

export default ProfileModal;
