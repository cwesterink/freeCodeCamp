import { Link } from 'gatsby';
import React, { useState } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
// import { Listbox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faCaretDown,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import GreenNotCompleted from '../../../assets/icons/green-not-completed';
import GreenPass from '../../../assets/icons/green-pass';
import { executeGA } from '../../../redux/actions';
import { SuperBlocks } from '../../../../../shared/config/superblocks';
import { ChallengeWithCompletedNode } from '../../../redux/prop-types';
import { isNewJsCert, isNewRespCert } from '../../../utils/is-a-cert';

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ executeGA }, dispatch);

interface Challenges {
  challengesWithCompleted: ChallengeWithCompletedNode[];
  isProjectBlock: boolean;
  superBlock: SuperBlocks;
  blockTitle?: string | null;
}

const CheckMark = ({ isCompleted }: { isCompleted: boolean }) =>
  isCompleted ? <GreenPass /> : <GreenNotCompleted />;

function Challenges({
  challengesWithCompleted,
  isProjectBlock,
  superBlock,
  blockTitle
}: Challenges): JSX.Element {
  const tags: string[] = [
    '<p>',
    'HELLO',
    'HTML',
    'static',
    'h1',
    'label',
    'form',
    'input'
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  function updateTagSelection(tag: string) {
    setSelectedTags(currentlySelectedTags => {
      if (currentlySelectedTags.some(t => t === tag)) {
        return currentlySelectedTags.filter(t => t !== tag);
      } else {
        return [...currentlySelectedTags, tag];
      }
    });
  }

  function tagSelected(tag: string) {
    return selectedTags.some(t => t === tag);
  }

  const { t } = useTranslation();

  const isGridMap = isNewRespCert(superBlock) || isNewJsCert(superBlock);

  const firstIncompleteChallenge = challengesWithCompleted.find(
    challenge => !challenge.isCompleted
  );

  const isChallengeStarted = !!challengesWithCompleted.find(
    challenge => challenge.isCompleted
  );

  return isGridMap ? (
    <>
      {firstIncompleteChallenge && (
        <div className='challenge-jump-link'>
          <Link
            className='btn btn-primary'
            to={firstIncompleteChallenge.fields.slug}
          >
            {!isChallengeStarted
              ? t('buttons.start-project')
              : t('buttons.resume-project')}{' '}
            {blockTitle && <span className='sr-only'>{blockTitle}</span>}
          </Link>
        </div>
      )}

      <div className='topics-list'>
        <button onClick={() => setDropDownOpen(!dropDownOpen)}>
          <span className='topics-right-pad'>Topics</span>
          <FontAwesomeIcon icon={faCaretDown} />
        </button>

        {dropDownOpen ? (
          <ul>
            {tags.map((tag, i) => (
              <li key={i}>
                {tagSelected(tag) ? (
                  <button key={i} onClick={() => updateTagSelection(tag)}>
                    <span className='topics-right-pad'>{tag}</span>
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                ) : (
                  <button
                    key={i}
                    className='topics-list-option-unselected'
                    onClick={() => updateTagSelection(tag)}
                  >
                    <span>{tag}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          ''
        )}

        <div className='topic-selections'>
          {selectedTags.map((tag, i) => (
            <div key={i} className='topics-button'>
              <button onClick={() => updateTagSelection(tag)}>
                <span className='topics-right-pad'>{tag}</span>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <nav
        aria-label={
          blockTitle ? t('aria.steps-for', { blockTitle }) : t('aria.steps')
        }
      >
        <ul className={`map-challenges-ul map-challenges-grid `}>
          {challengesWithCompleted.map((challenge, i) => (
            <li
              className={`map-challenge-title map-challenge-title-grid ${
                isProjectBlock ? 'map-project-wrap' : 'map-challenge-wrap'
              }`}
              id={challenge.dashedName}
              key={`map-challenge ${challenge.fields.slug}`}
            >
              {!isProjectBlock ? (
                <Link
                  to={challenge.fields.slug}
                  className={`map-grid-item ${
                    +challenge.isCompleted ? 'challenge-completed' : ''
                  }`}
                >
                  <span className='sr-only'>{t('aria.step')}</span>
                  <span>{i + 1}</span>
                  <span className='sr-only'>
                    {challenge.isCompleted
                      ? t('icons.passed')
                      : t('icons.not-passed')}
                  </span>
                </Link>
              ) : (
                <Link to={challenge.fields.slug}>
                  {challenge.title}
                  <span className=' badge map-badge map-project-checkmark'>
                    <CheckMark isCompleted={challenge.isCompleted} />
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  ) : (
    <ul className={`map-challenges-ul`}>
      {challengesWithCompleted.map(challenge => (
        <li
          className={`map-challenge-title ${
            isProjectBlock ? 'map-project-wrap' : 'map-challenge-wrap'
          }`}
          id={challenge.dashedName}
          key={'map-challenge' + challenge.fields.slug}
        >
          {!isProjectBlock ? (
            <Link to={challenge.fields.slug}>
              <span className='badge map-badge'>
                <CheckMark isCompleted={challenge.isCompleted} />
              </span>
              {challenge.title}
            </Link>
          ) : (
            <Link to={challenge.fields.slug}>
              {challenge.title}
              <span className='badge map-badge map-project-checkmark'>
                <CheckMark isCompleted={challenge.isCompleted} />
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

Challenges.displayName = 'Challenges';

export default connect(null, mapDispatchToProps)(withTranslation()(Challenges));
