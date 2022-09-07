import {ChangeEventInterface, DocumentInterface} from './../../types/interfaces';
import { VotesInterface } from '../../types/interfaces';
import * as enums from '@/types/enums';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootState, VotingModuleState } from '../types';
import { VOTING_OPTIONS } from '@/types/constants';
import { SectionInterface, ArgumentInterface, NotifySubscriberPayloadInterface } from '@/types/interfaces';
import getMailDataForNotification from '@/services/getMailDataForNotification';

const vueAppData = process.env.VUE_APP_DATA;
const moduleDecorators = require(`../../decorators/${vueAppData}Decorators/${vueAppData}ModuleDecorators`).default;

type routerModuleGetter = GetterTree<VotingModuleState, RootState>;

const state: VotingModuleState = {};

const getters: routerModuleGetter = {
  isUserVoted: (state, getters, dispatch, rootGetters) => (object: SectionInterface | DocumentInterface, vote) => {
    const ownerUid = rootGetters['usersModule/user'].uid;
    return object[vote].includes(ownerUid);
  },

  votingOptionsKeys: (state) => {
    return Object.keys(VOTING_OPTIONS);
  },
  /**
   * get the updated votes
   */
  updatedVoted: (state, getters, dispatch, rootGetters) => (type, object, vote) => {
    const userId = rootGetters['usersModule/userUid'];
    const votes: any = {
      pros: object.pros,
      cons: object.cons,
    };
    let isUserVotedTwicePROSconditional;
    if (type === 'document' && object.documentConditionalSupport) {
      votes.prosConditional = object.prosConditional;
      isUserVotedTwicePROSconditional = object.prosConditional.includes(userId);
    }
    const isUserVotedTwicePROS = object.pros.includes(userId);
    const isUserVotedTwiceCONS = object.cons.includes(userId);
    votes[vote].push(userId);
    let logMessage = 'User ' + userId + ' voted ' + vote;
    if (isUserVotedTwicePROS) {
      votes.pros = object.pros.filter((uid) => uid !== userId);
      logMessage += '\nUser Voted Twice PROS, New votes.pros: ' + JSON.stringify(votes.pros);
    }
    if (isUserVotedTwiceCONS) {
      votes.cons = object.cons.filter((uid) => uid !== userId);
      logMessage += '\nUser Voted Twice CONS, New votes.cons: ' + JSON.stringify(votes.cons);
    }
    if (type === 'document' && object.documentConditionalSupport) {
      if (isUserVotedTwicePROSconditional) {
        votes.prosConditional = object.prosConditional.filter((uid) => uid !== userId);
        logMessage += '\nUser Voted Twice PROS conditional, New votes.prosConditional: ' + JSON.stringify(votes.prosConditional);
      }
    }
    logMessage += "\nNew votes: " + JSON.stringify(votes);
    console.log(logMessage);
    return votes;
  },
  isSectionReachedToThreshold: (state) => (section, votes) => {
    return section.threshold + votes.cons.length - votes.pros.length === 0;
  },
  /**
   * calculated the new consensus
   * @param {number} prosLength how many users voted pros
   * @param {number} consLength how many users voted cons
   *
   */
  getNewConsensus: (state, getters, dispatch, rootGetters) => (prosLength, consLength) => {
    const participantsSize = rootGetters['usersModule/participantsSize'];
    const ratioProCon = 1 - consLength / prosLength;
    const ratioVoters = prosLength / participantsSize;
    return ratioProCon * ratioVoters;
  },
  /**
   * gets the consensus array of the document with the new consensus
   * @param {number} consensus_meter
   */
  getNewConsensusesArray: (state, getters, dispatch, rootGetters) => (consensus_meter) => {
    //return [...rootGetters['documentsModule/documentConsensuses'], consensus_meter];
    return (rootGetters['documentsModule/documentConsensuses']).concat(consensus_meter);
  },
  /**
   * calculates the new threshold of the document
   * @param {number[]} documentConsensuses all the consensus of the document so far
   */
  getNewThreshold: (state, getters, dispatch, rootGetters) => (documentConsensuses) => {
    const participantsSize = rootGetters['usersModule/participantsSize'];
    const sum = documentConsensuses.reduce((acc, val) => acc + val);
    const consensusesAvg = sum / documentConsensuses.length;
    return Math.round(consensusesAvg * participantsSize);
  },
  /**
   * get the next status
   * @param {SectionInterface} section
   */
  getNewStatus: (state) => (section) => {
    switch (section.status) {
      case enums.SECTION_STATUS.inTheVote:
        return enums.SECTION_STATUS.approved;
      case enums.SECTION_STATUS.toEdit:
        return enums.SECTION_STATUS.edited;
      case enums.SECTION_STATUS.toDelete:
        return enums.SECTION_STATUS.deleted;
      case enums.SECTION_STATUS.rejected:
        return enums.SECTION_STATUS.approved;
      case enums.SECTION_STATUS.toEditInTheVote:
        return enums.SECTION_STATUS.approved;
    }
  },
};

const mutations: MutationTree<VotingModuleState> = {};

const actions: ActionTree<VotingModuleState, RootState> = {
   /**
   * add vote to section / document
   * @param {SectionInterface} section
   * @param {VotesInterface} vote
   */
  addVote: async ({ state, getters, dispatch, rootGetters }, { type, object, vote }: { type: 'document' | 'section'; object: SectionInterface | DocumentInterface; vote: string }) => {
    console.log('Add ' + type + ' Vote ' + vote);
    const updatedVotes = getters.updatedVoted(type, object, vote);
    const theModule = `${type}sModule`;
    let dispatchType = `${theModule}/update${type.charAt(0).toUpperCase() + type.slice(1)}`;
    let dispatchPayload = {
      id: object.id,
      updateObject: updatedVotes,
    };
    console.log('Dispatch ' + dispatchType + ': ' + JSON.stringify(dispatchPayload));
    const newChangeEvent = {
      createdAt: new Date(),
      type: 'User Voted For Suggestion',
      subType: `voted ${vote}` ,
      itemId: object.id,
      parentItemId: object.id,
      creator: rootGetters['usersModule/userUid']
    };
    await dispatch( dispatchType, dispatchPayload, { root: true });
    if (getters.isUserVoted(object, vote)) {
      await dispatch( 'changeEventsModule/addChangeEvent', newChangeEvent, { root: true });
    }
    return updatedVotes;
  },
  /**
   * updates document and all sections that needs to be update after section reached threshold - section accepted
   * @param {VotesInterface} updatedVotes
   * @param {SectionInterface} section
   * @param {string} parentSectionId
   */
  updateConsensusAndThreshold: async (
    { getters, dispatch, rootGetters },
    { updatedVotes, section, parentSectionId }: { updatedVotes: VotesInterface; section: SectionInterface; parentSectionId: string }
  ) => {
    const consensus_meter = getters.getNewConsensus(updatedVotes.pros.length, updatedVotes.cons.length);
    const consensuses = getters.getNewConsensusesArray(consensus_meter);
    const threshold = getters.getNewThreshold(consensuses);
    await dispatch('documentsModule/updateDocument', { updateObject: { consensus_meter, consensuses, threshold } }, { root: true });
    await dispatch('updateParentSectionByStatus', {section, parentSectionId})
    await dispatch(
      'sectionsModule/updateSection',
      {
        id: section.id,
        updateObject: {
          acceptedAt: section.acceptedAt ? section.acceptedAt : new Date(),
          status: getters.getNewStatus(section),
          parentSectionId: section.status === enums.SECTION_STATUS.toEditInTheVote ? '0' : parentSectionId,
        },
      },
      { root: true },
    );

    const documentId = rootGetters['documentsModule/documentId'];

    const { body, title } = await getMailDataForNotification({
      documentId,
      documentTitle: rootGetters['documentsModule/documentTitle'],
      sectionId: section.id as string,
      sectionOrArgumentContent: section.content,
      userName: rootGetters['usersModule/displayName'],
      trigger: enums.NOTIFICATION_TRIGGER.sectionApproval,
    });

    const notificationPayload: NotifySubscriberPayloadInterface = {
      documentId,
      sectionId: section.id as string,
      trigger: enums.NOTIFICATION_TRIGGER.sectionApproval,
      sectionOrArgumentContent: section.content,
      body,
      title
    };
    dispatch('notificationsModule/notifySubscribers', notificationPayload, { root: true });
    
    const newChangeEvent = {
      createdAt: section.acceptedAt ? section.acceptedAt : new Date(),
      type: 'New ' + (section.parentSectionId != '0' ? 'Edit ' : '') + 'Section Suggestion Was Accepted',
      subType: null,
      itemId: section.id,
      parentItemId: section.id,
      documentId,
      creator: section.owner,
      content: { title, body }
    };
    await dispatch( 'changeEventsModule/addChangeEvent', newChangeEvent, { root: true });
    await dispatch(
      'sectionsModule/updateThreshold',
      {
        parentSectionId,
        threshold,
      },
      { root: true },
    );
  },
  addPrivilegeVote: async ({ dispatch, getters, rootGetters }, { section, parentSectionId, vote }) => {
    const newStatus = vote === enums.VOTING_OPTIONS.pros ? getters.getNewStatus(section) : enums.STATIC_STATUS.rejected;
    if (section.status !== enums.SECTION_STATUS.inTheVote) {
      await dispatch(
        'sectionsModule/updateParentSection',
        {
          parentSectionId,
          sectionId: section.id,
          newStatus,
          prevStatus: section.status,
          acceptedByEditor: rootGetters['usersModule/userUid'],
        },
        { root: true },
      );
    } else {
      await dispatch(
        'sectionsModule/updateSection',
        {
          id: section.id,
          updateObject: {
            acceptedByEditor: rootGetters['usersModule/userUid'],
          },
        },
        { root: true },
      );
    }
    await dispatch(
      'sectionsModule/updateSection',
      {
        id: section.id,
        updateObject: {
          acceptedAt: section.acceptedAt ? section.acceptedAt : new Date(),
          status: newStatus,
          parentSectionId,
          // acceptedByEditor: rootGetters["usersModule/userUid"],
        },
      },
      { root: true },
    );
  },
  updateParentSectionByStatus: async({dispatch, getters, rootGetters}, {section, parentSectionId}) => {
    if (section.status === enums.SECTION_STATUS.inTheVote) {
      const sectionsIds = rootGetters['sectionsModule/sectionsIdsByParentId'](section.id);
      if (sectionsIds.length > 0) {
        sectionsIds.forEach(async sectionId => {
          await dispatch('sectionsModule/updateSection', {
            id: sectionId,
            updateObject: {
              status: enums.SECTION_STATUS.toEdit
            }
          }, {root: true})
        })
        await dispatch('sectionsModule/updateSection', {
          id: section.id,
          updateObject: {
            toEdit: section.toEdit.concat(sectionsIds)
          }
        }, {root: true})
      }
    }
    else if (section.status === enums.SECTION_STATUS.toEditInTheVote) {
      let sectionsIds = rootGetters['sectionsModule/sectionsIdsByParentId'](section.parentSectionId);
      sectionsIds.push(section.parentSectionId)
      sectionsIds = sectionsIds.filter(sectionId => sectionId !== section.id)
      sectionsIds.forEach(async sectionID => {
        await dispatch('sectionsModule/updateSection', {
          id: sectionID,
          updateObject: {
            parentSectionId: section.id,
            status: enums.SECTION_STATUS.toEdit
          }
        }, { root: true })
      })
      await dispatch('sectionsModule/updateSection', {
        id: section.id,
        updateObject: {
          toEdit: section.toEdit.concat(sectionsIds)
        }
      }, {root: true})
    }
    else if (section.status === enums.SECTION_STATUS.toEdit || section.status === enums.SECTION_STATUS.toDelete) {
      console.log('updateing parent to edit')
      await dispatch(
        'sectionsModule/updateParentSection',
        {
          parentSectionId,
          sectionId: section.id,
          newStatus: getters.getNewStatus(section),
          prevStatus: section.status,
          acceptedByEditor: null,
        },
        { root: true },
      );
    }
  }
};

const vModule = {
  state,
  namespaced: true,
  getters,
  mutations,
  actions,
  moduleName: '',
  statePropName: '',
  sync: {},
  serverChange: {},
  fetch: {
    docLimit: 0,
  },
};
console.log('Decorate Voting Module');
moduleDecorators['votingModuleDecorator'](vModule);
export const votingModule = vModule;
