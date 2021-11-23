import { useEffect, useState } from "react";
import "./Reaction.scss";
import {
  getReactions,
  getUserContentReactions,
  addUserContentReaction,
  deleteUserContentReaction,
} from "../api/ReactionAPI";
import ReactionSummary from "./ReactionSummary";
import ReactTooltip from "react-tooltip";

function Reaction(props) {
  const [reactions, setReactions] = useState([]);
  const [reactedCounts, setReactedCounts] = useState([]);
  const [showReactionEmojis, setShowReactionEmojis] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [showReactionSummary, setShowReactionSummary] = useState(false);
  const [activeSummaryTab, setActiveSummaryTab] = useState();
  const [curUserReactions, setCurUserReactions] = useState([]);

  // Fetch Reactions, User Content Reactions on init
  // Aggregate user reacted counts by reaction
  useEffect(() => {
    function getReactedCountsById(_rs, _cRnList) {
      return _rs.map((_reaction) => {
        const _cRnListById = _cRnList.filter(
          (_cRn) => _cRn.reaction_id === _reaction.id
        );
        return {
          ..._reaction,
          count: _cRnListById.length,
          isUserReacted: !!_cRnListById.find(
            (contentReaction) => contentReaction.user_id === props.userId
          ),
        };
      });
    }

    Promise.all([
      getReactions(),
      getUserContentReactions({ content_id: props.contentId }),
    ]).then(([_reactions, _cReactions]) => {
      setReactions(_reactions.data);
      setUserReactions(_cReactions.data);
      setReactedCounts(getReactedCountsById(_reactions.data, _cReactions.data));
    });
  }, [props.userId, props.contentId]);

  // Update active user content reactions state
  useEffect(() => {
    setCurUserReactions(
      userReactions.filter(
        (userReaction) => userReaction.user_id === props.userId
      )
    );
  }, [props.userId, userReactions]);

  // Method called when click at a reaction emoji
  const onSelectReaction = (selectedReaction) => {
    setShowReactionEmojis(false);
    const user_reaction_idx = userReactions.findIndex(
      (userReaction) =>
        userReaction.reaction_id === selectedReaction.id &&
        userReaction.user_id === props.userId
    );
    if (user_reaction_idx >= 0) {
      // If user already reacted
      deleteUserContentReaction(userReactions[user_reaction_idx].id).then(
        () => {
          updateReactedCounts(selectedReaction);
          userReactions.splice(user_reaction_idx, 1);
          setUserReactions([...userReactions]);
        }
      );
    } else {
      // If user just selected this emoji
      const userReactedData = {
        reaction_id: selectedReaction.id,
        user_id: props.userId,
        content_id: props.contentId,
      };
      addUserContentReaction(userReactedData).then((res) => {
        updateReactedCounts(selectedReaction);
        userReactions.push({ ...userReactedData, id: res.data.id });
        setUserReactions([...userReactions]);
      });
    }
  };

  // Method to idenfify, is the user already reacted given reaction or not
  function isUserReacted(reaction) {
    return !!curUserReactions.find(
      (userReaction) => userReaction.reaction_id === reaction.id
    );
  }

  // Method to update reacted count details
  function updateReactedCounts(reaction) {
    let reactedCountData = reactedCounts.find(
      (reactedCount) => reactedCount.id === reaction.id
    );
    if (reactedCountData) {
      if (isUserReacted(reaction)) {
        reactedCountData.count -= 1;
        reactedCountData.isUserReacted = false;
      } else {
        reactedCountData.count += 1;
        reactedCountData.isUserReacted = true;
      }
    } else {
      reactedCounts.push({ ...reaction, count: 1, isUserReacted: true });
    }
    setReactedCounts([...reactedCounts]);
  }

  // Method to toggle reaction summary data
  const toggleReactionSummary = (state, reaction) => {
    setShowReactionSummary(state);
    setActiveSummaryTab(reaction.id);
  };

  const ReactionEmojis = () => {
    return (
      <>
        <ul className="ReactionEmojis">
          {reactions.map((reaction) => (
            <li
              className="ReactionEmojis-item"
              key={reaction.id}
              data-for="trigger-emoji"
              data-tip={reaction.name}
              data-offset="{'top': 5}"
            >
              <button
                className="ReactionEmojis-btn"
                onClick={() => onSelectReaction(reaction)}
              >
                <span className="emoji">{reaction.emoji}</span>
              </button>
            </li>
          ))}
        </ul>
        <ReactTooltip
          id="trigger-emoji"
          className="EmojiTooltip"
          backgroundColor="#161616"
          place="top"
          type="dark"
          effect="solid"
        />
      </>
    );
  };

  const ReactionEmojiTriggerBtn = () => {
    return (
      <button
        className="ReactionEmojiTriggerBtn"
        onClick={() => setShowReactionEmojis(!showReactionEmojis)}
      >
        <img
          className="ReactionEmojiTriggerBtn-emoji"
          src="./emoji-add.svg"
          alt="emoji-add"
        />
      </button>
    );
  };

  const ReactedCounts = () => {
    return (
      <div className="ReactedCounts">
        {reactedCounts.map(
          (reaction) =>
            reaction.count >= 1 && (
              <button
                className={`ReactedCounts-btn ${
                  reaction.isUserReacted ? "active" : ""
                }`}
                key={reaction.id}
                onClick={() => onSelectReaction(reaction)}
                onMouseOver={() => toggleReactionSummary(true, reaction)}
                onMouseLeave={() => setShowReactionSummary(false)}
                data-for="reaction-summary"
              >
                <span>{reaction.emoji}</span>
                <span>&middot;</span>
                <span>{reaction.count}</span>
              </button>
            )
        )}
      </div>
    );
  };
  return (
    <div className="Reaction">
      <div className="Reaction-container">
        {showReactionEmojis && <ReactionEmojis />}
        <div className="Reaction-trigger-count">
          <ReactionEmojiTriggerBtn />
          <ReactedCounts />
        </div>
      </div>

      <div
        className={`Reaction-summary-container ${
          showReactionSummary ? "show" : "hide"
        }`}
        onMouseMove={() => setShowReactionSummary(true)}
        onMouseLeave={() => setShowReactionSummary(false)}
      >
        <ReactionSummary
          reactions={reactions}
          reactedCounts={reactedCounts}
          userReactions={userReactions}
          activeTab={activeSummaryTab}
          onTabChange={setActiveSummaryTab}
        />
      </div>
    </div>
  );
}

export default Reaction;
