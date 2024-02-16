import React from "react";
import { rooms } from "./room-data";

interface HeaderProps {
  room: string | false;
  handleSwitch: (ev: React.SyntheticEvent) => void;
  handleLogOut: () => void;
}
const Header = ({
  room,
  handleSwitch,
  handleLogOut,
}: HeaderProps): JSX.Element => {
  return (
    <div>
      <div className="header d-flex justify-content-between">
        <h4 className="text-no-wrap">
          The {`${room}`} Room
          <span className="d-block small">
            <small>@Chatterbox</small>
          </span>
        </h4>

        <div className="d-inline-flex text-end flex-column-reverse">
          <select
            required
            className="btn btn-secondary btn-sm"
            style={{
              appearance: "none",
            }}
            name="switch-room"
            id="switch-room"
            onChange={handleSwitch}
          >
            <option value="">Switch Rooms</option>
            {rooms.map(({ key, name }, i) => (
              <option value={key} key={i}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleLogOut}
            style={{ marginBottom: 8 }}
          >
            Log Out &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
