import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import Note from "../../components/cards/note";
import Edit from "./edit";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Instance from "../../utils/axios";
import moment from "moment";
import Toast from "../../components/toastmessage/Toast";
import AddNotesImg from "../../assets/images/add-notes.svg";
import EmptyCard from "../../components/emptycard/EmptyCard";
import NoData from "../../assets/images/no-data-icon.svg";

function Home() {
  const [openModal, setOpenModal] = useState({
    type: "add",
    data: null,
    isShown: false,
  });

  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: "",
  });

  const [userInfo, setUserInfo] = useState();
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);

  const handleEdit = (noteDetails) => {
    setOpenModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastt = (type, message) => {
    setShowToast({
      isShown: true,
      message,
      type,
    });
  };

  const handleCLoseToast = () => {
    setShowToast({
      isShown: false,
      message: "",
      type: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await Instance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await Instance.get("/get-notes");
      if (response.data && response.data.notes) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await Instance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastt("delete", "Note deleted successfully");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Error:", error.response.data.message);
      }
    }
  };

  const onSearch = async (query) => {
    try {
      const response = await Instance.get("/search", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Pinned = async (data) => {
    const noteId = data._id;
    try {
      const response = await Instance.put("update-note-pinned/" + noteId, {
        isPinned: !data.isPinned,
      });
      if (response.data && response.data.note) {
        showToastt("success", "Note updated successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClear = () => {
    setSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearch={onSearch}
        handleClear={handleClear}
      />
      <div className="container mx-auto p-6">
        {notes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {notes.map((item) => (
              <Note
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMM 'YY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                OnPin={() => Pinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={search ? NoData : AddNotesImg}
            message={
              search
                ? "No results found"
                : "Start creating your notes! Click the 'Add' button to get started "
            }
          />
        )}
      </div>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <Modal
        isOpen={openModal.isShown}
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <Edit
          type={openModal.type}
          noteData={openModal.data}
          onClose={() => {
            setOpenModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastt={showToastt}
        />
      </Modal>
      <Toast
        isShown={showToast.isShown}
        message={showToast.message}
        type={showToast.type}
        onClose={handleCLoseToast}
      />
    </>
  );
}

export default Home;
