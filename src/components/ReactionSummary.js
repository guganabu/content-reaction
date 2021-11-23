import { useEffect, useState } from "react";
import { getUsers } from "../api/UserAPI";

import "./ReactionSummary.scss";

function ReactionSummary(props) {
  const [users, setUsers] = useState([]);
  const [activeTabReactionDetails, setActiveTabReactionDetails] = useState([]);

  // Fetch users on init
  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res.data);
    });
  }, []);

  // Set active tab's reactions summary details
  useEffect(() => {
    setActiveTabReactionDetails(
      props.activeTab === "all"
        ? props.userReactions
        : [
            ...props.userReactions.filter(
              (userReaction) => userReaction.reaction_id === props.activeTab
            ),
          ]
    );
  }, [props.activeTab, props.userReactions]);

  const ReactionSummaryTab = () => {
    return (
      <ul className="ReactionSummaryTab">
        <li
          key="all"
          className={`ReactionSummaryTab-item ${
            props.activeTab === "all" ? "active" : ""
          }`}
          onClick={() => props.onTabChange("all")}
        >
          <span>All</span>
        </li>
        {props.reactedCounts.map((reactedCount) => {
          return (
            reactedCount.count >= 1 && (
              <li
                key={reactedCount.id}
                className={`ReactionSummaryTab-item ${
                  props.activeTab === reactedCount.id ? "active" : ""
                }`}
                onClick={() => props.onTabChange(reactedCount.id)}
              >
                <span>{reactedCount.emoji}</span>
                <span>&middot;</span>
                <span>{reactedCount.count}</span>
              </li>
            )
          );
        })}
      </ul>
    );
  };

  const ReactionSummaryDetails = () => {
    return (
      <div className="ReactionSummaryDetails">
        {activeTabReactionDetails.map((_uCReaction, index) => {
          const user = users.find((user) => user.id === _uCReaction.user_id);
          const reaction = props.reactions.find(
            (_reaction) => _reaction.id === _uCReaction.reaction_id
          );
          return (
            <div className="ReactionSummaryDetails-item" key={index}>
              <img src={user.avatar} className="user-avatar" alt="avatar" />
              <span className="user-reacted-emoji">
                {reaction ? reaction.emoji : ""}
              </span>
              <span className="user-name">
                {user ? user.last_name + " " + user.first_name : ""}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={props.style} className="ReactionSummary">
      <div className="ReactionSummary-title">Reactions</div>
      <ReactionSummaryTab />
      <ReactionSummaryDetails />
    </div>
  );
}

export default ReactionSummary;
