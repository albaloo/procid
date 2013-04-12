class IdeapageController < ApplicationController

	def setIdeaStatus
                issueLink = params[:issueLink]
		commentTitle = params[:commentTitle]
                ideaStatus = params[:status]

		if(issueLink.ends_with?('#'))
                  issueLink.chop
                end
		currentIssue = Issue.first(:link => issueLink)
		currentCommentIdea = Comment.first({:title => commentTitle, :issue=>currentIssue}).ideasource
		currentCommentIdea.attributes = {
			:status=>ideaStatus
		}
		currentCommentIdea.save

		render :json => { }
	end

        def addCriteria
		issueLink = params[:issueLink]
		userName = params[:userName]
		criteriaTitle = params[:title]
                criteriaDescription = params[:description]
                criteriaID = params[:id]
		
		if(issueLink.ends_with?('#'))
                  issueLink.chop
                end
		currentIssue = Issue.first(:link => issueLink)
		currentParticipant = Participant.first_or_create({:user_name =>userName})#,{:link=>issue["authorLink"]})
		currentCriteria = Criteria.first_or_create({:issue => currentIssue, :id => criteriaID},{:title=>criteriaTitle, :description=>criteriaDescription, :participant => currentParticipant})
		currentCriteria.save
		render :json => { }		
	end

	def editCriteria

	end

	def deleteCriteria

	end

	def addComment

	end
end
