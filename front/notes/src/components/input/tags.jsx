import React from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { useState } from "react";

const tTags = ({ tags, setTags }) => {
  const [inpValue, setInpValue] = useState("");
  const inpChange = (e) => {
    setInpValue(e.target.value);
  };
  const newTag = () => {
    if (inpValue.trim() !== "") {
      setTags([...tags, inpValue.trim()]);
      setInpValue("");
    }
  };
  const keyDown = (e) => {
    if (e.key === "Enter") {
      newTag();
    }
  };
  const removeTag = (remove) => {
    setTags(
      tags.filter((tag) => {
        tag !== remove;
      })
    );
  };
  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded"
            >
              # {tag}
              <button
                onClick={() => {
                  removeTag(tag);
                }}
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inpValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          onChange={inpChange}
          onKeyDown={keyDown}
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700"
          onClick={() => {
            newTag();
          }}
        >
          <MdAdd className="text-2xl text-blue-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default tTags;
