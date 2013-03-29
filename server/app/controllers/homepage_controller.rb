class HomepageController < ApplicationController
	skip_before_filter :verify_authenticity_token
	@@data = Rails.root.to_s+'/input.json'


	def postcomments
		#render :nothing => true
		commentInfos = ActiveSupport::JSON.decode(params[:commentInfos])
		issue = ActiveSupport::JSON.decode(params[:issue])
=begin
		tmp_file = "#{Rails.root}/out.txt"
		File.open(tmp_file, 'wb') do |f|
			f.write input[0]["author"]
		end
=end
		issueId = processInputFile(commentInfos,issue)
		prepareOutputFile(issueId)
	end
	
	def processInputFile(commentInfos,issue)
		
		threadInitiator = Participant.first_or_create({:user_name =>issue["author"]},{:link=>issue["authorLink"]})
		currentIssue = Issue.first_or_create({:title => issue["title"]},{:status =>issue["status"],:participant=>threadInitiator,:link => issue["link"]})
		
		#We only need to process the comments that haven't been processed yet.
		numPrevComments = currentIssue.find_num_previous_comments
		index = 0;
		if(numPrevComments < commentInfos.length)	
			index = numPrevComments;
		end
	
		commentInfos.from(index).each do |curr|	
			currentParticipant = Participant.first_or_create({:user_name =>curr["author"]},{:link=>curr["authorLink"]})
			currentComment = Comment.first_or_create(:link => curr["link"])
			currentComment.attributes = {
						:title => curr["title"],
						:link => curr["link"],
						:content => curr["content"],
						:participant => currentParticipant,
						:issue=>currentIssue
						}
			tags = curr["tags"]
			tags.each do |t|
				tag = Tag.first_or_create({:name => t, :comment => currentComment})		
			end						
			#idea = Idea.first_or_create(:status=>curr["status"])
			#comment.ideasource = idea
			#idea.relatedcomments << comment
			
			
			#input["tags"].each do |t|
			#	tag = Tag.first_or_create(:name => t)
			#	comment.tags << tag
			#end
			
			currentComment.raise_on_save_failure = true
			currentComment.save
		end
		return currentIssue.id	
	end
	
	def find_conversations
		#comments=
	end

	def prepareOutputFile(issueId)
		comments_json=Array.new
		issue = Issue.first(:id => issueId)
		comments=Comment.all(:issue => issue)
		count=0
		comments.each do |curr|
			curr_json=Hash.new
			curr_json["title"]=comments[count].title
			curr_json["link"]=comments[count].link
			curr_json["author"]=comments[count].participant.user_name
			curr_json["authorLink"]=comments[count].participant.link
			curr_json["content"]=comments[count].content
			curr_json["tags"]=comments[count].tags.map{|tag| tag.name}
			curr_json["status"]="Ongoing"
			curr_json["comments"]=Array.new
			curr_json["idea"]="#1"
			curr_json["tone"]="positive"
			curr_json["criteria"]=Array.new
			comments_json[count]=curr_json
			count=count+1
		end
		final_json=Hash.new
		final_json["issueComments"]=comments_json	
		render :json => final_json.to_json
	end
end
