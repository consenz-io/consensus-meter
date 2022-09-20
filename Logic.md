# <a id="consensusMeter">__Consensus Meter Logic__</a>
Every time thet an edit suggestion is accepted and enter the agreement, a new section_consensus_meter is added to consensuses field.

The value of the sectionConsensus is calculated according to votes count on the section that have been accepted or removed as follows:

For section accepted:
- new consensuses item = (upvotes - downvotes) / totalUsers

Every time a new sectionConsensus is created, document_consensus_meter is updated. 
The value of the new document_consensus_meter is calculated according to all section_consensus_meter average.

Every time the document_consensus_meter is updated, document_threshold is updated.
The value of document_threshold is document_consensus_meter * document users count.

document updated threshold will apply on all sections that are up to vote, and on new section suggestions and edit section suggestions that will be added by users.

## Variables:
- consensusesArray: sections_consenus_meter
- x: the removed/acceppted section
- sectionDocumentId: the id of the [document](./README.md/#document_definition) the removed section relates to
- totalUsers: the document users count
- consensusMeterAverage: sum of all sections_consenus_meter / approved sections count

     
    sectionConsensus = (upvotes - downvotes) / totalUsers
      Add sectionConsensus to consensusesArray
      Add sectionConsensus to consensusMeterAverage
    
    newThreshold = consensusMeterAverage * totalUsers
      Apply newThreshold to all sections in discusstion and new sections as well:
        let be a section which its documentId is sectionDocumentId, than
        s.threshold = newThreshold
      Apply newThreshold to new sections in the document.
