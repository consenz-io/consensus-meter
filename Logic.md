# <a id="consensusMeter">__Consensus Meter Logic__</a>
Every time thet an edit suggestion is accepted and enter the agreement, a new section_consensus_meter is added to consensuses field.

The value of the section_consensus_meter is calculated according to votes count on the section that have been accepted or removed as follows:

For section accepted:
- new consensuses item = (1 - ([con](./data_model.md/#section_cons) votes count /  [pro](./data_model.md/#section_pros) votes count)) * ([pro](./data_model.md/#section_pros)) / document users count)

Every time a new section_consensus_meter is created, document_consensus_meter is updated. 
The value of the new document_consensus_meter is calculated according to all section_consensus_meter average.

Every time the document_consensus_meter is updated, document_threshold is updated.
The value of document_threshold is document_consensus_meter * document users count.

document updated threshold will apply on all sections that are up to vote, and on new section suggestions and edit section suggestions that will be added by users.

## Variables:
- consensusesArray: sections_consenus_meter
- x: the removed/acceppted section
- sectionDocumentId: the id of the [document](./README.md/#document_definition) the removed section relates to
- usersCount: the document users count
- consensusMeterAverage: sum of all sections_consenus_meter / sections of status 1 + 5 count

     
    sectionConsensus = (1 - (x.pros / x.cons)) * ((x.cons) / usersCount)
      Add sectionConsensus to consensusesArray
      Add sectionConsensus to consensusMeterAverage
    
    newThreshold = consensusMeterAverage * usersCount
      Apply newThreshold to all sections in discusstion and new sections as well:
        let be a section which its documentId is sectionDocumentId, than
        s.threshold = newThreshold
      Apply newThreshold to new sections in the document.
