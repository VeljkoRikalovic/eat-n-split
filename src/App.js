import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [friends, setfriends] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleShowForm() {
    setShowForm((form) => !form);
  }

  function handleAddFriend(newFrined) {
    setfriends((fr) => [...fr, newFrined]);
    setShowForm(false);
  }

  function handleSelection(friend) {
    setSelectFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowForm(false);
  }

  function handleSplitBill(value) {
    setfriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={selectFriend}
          onSelection={handleSelection}
        />
        {showForm && <FormAddFriend onSetFr={handleAddFriend} />}
        <Button onClick={handleShowForm}>
          {!showForm ? "Add friend" : "close"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill friend={selectFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );

  function FriendsList({ friends, onSelection, selected }) {
    return (
      <ul className="sidebar">
        {friends.map((e) => (
          <Friends
            e={e}
            key={e.id}
            onSelection={onSelection}
            selected={selected}
          />
        ))}
      </ul>
    );
  }

  function Friends({ e, onSelection, selected }) {
    const isSelected = selected?.id === e.id;

    return (
      <>
        <li className={isSelected ? "selected" : ""}>
          <img src={e.image} alt="" />
          <h3>{e.name}</h3>
          {e.balance < 0 && (
            <p className="red">
              You owe {e.name} {Math.abs(e.balance)}€
            </p>
          )}
          {e.balance > 0 && (
            <p className="green">
              {e.name} owes you {Math.abs(e.balance)}€
            </p>
          )}
          {e.balance === 0 && <p>You are {e.name} are even</p>}

          <Button onClick={() => onSelection(e)}>
            {!isSelected ? "Select" : "Close"}
          </Button>
        </li>
      </>
    );
  }

  function Button({ children, onClick }) {
    return (
      <button className="button" onClick={onClick}>
        {children}
      </button>
    );
  }

  function FormAddFriend({ onSetFr }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState("https://i.pravatar.cc/48");

    function handleSubmit(e) {
      e.preventDefault();

      if (!name || !image) return;
      const id = crypto.randomUUID();
      const newFrined = { id, name, image: `${image}?u=${id}`, balance: 0 };
      onSetFr(newFrined);
      setName("");
      setImage("https://i.pravatar.cc/48");
    }

    return (
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🙋‍♂️ Friend</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>🖼️ Image url</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>Add</Button>
      </form>
    );
  }

  function FormSplitBill({ friend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const [whoIsPaying, setWhoIsPaying] = useState("user");
    const paidByFriend = bill - paidByUser;

    function handleSubmit(e) {
      e.preventDefault();

      if (!bill || !paidByUser) return;
      onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    }

    return (
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2> Split a bill with {friend.name}</h2>
        <label>💰 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(+e.target.value)}
        />
        <label>🤨 Your expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
          }
        />
        <label>🙎‍♂️ {friend.name} expense</label>
        <input type="text" disabled value={paidByFriend} />
        <label>🤷‍♂️ Who is paying the bill</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{friend.name}</option>
        </select>
        <Button>Split bill</Button>
      </form>
    );
  }
}
