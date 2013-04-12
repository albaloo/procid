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

	end

	def editCriteria

	end

	def deleteCriteria

	end

	def addComment

	end
end
