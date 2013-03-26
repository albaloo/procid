class HomepageController < ApplicationController
	skip_before_filter :verify_authenticity_token
	@@data = Rails.root.to_s+'/input.json'


	def postcomments
		render :nothing => true
		input = ActiveSupport::JSON.decode(params[:commentInfos])
		issue = ActiveSupport::JSON.decode(params[:issue])
=begin
		tmp_file = "#{Rails.root}/out.txt"
		File.open(tmp_file, 'wb') do |f|
			f.write input[0]["author"]
		end
=end
		processInput(input,issue)
	end
	
	def processInput(input,issue)
		
		part = Participant.first_or_create({:user_name =>issue["author"]},{:link=>issue["authorLink"]})
		iss = Issue.first_or_create({:title => issue["title"]},{:status =>issue["status"],:participant=>part,:link => issue["link"]})
		
			
		input.each do |curr|	
			part = Participant.first_or_create({:user_name =>curr["author"]},{:link=>curr["authorLink"]})
			comment = Comment.first_or_create(:link => curr["link"])
			comment.attributes = {
						:title => curr["title"],
						:link => curr["link"],
						:content => curr["content"],
						:participant => part,
						:issue=>iss
						}
						
			#idea = Idea.first_or_create(:status=>curr["status"])
			#comment.ideasource = idea
			#idea.relatedcomments << comment
			
			
			#input["tags"].each do |t|
			#	tag = Tag.first_or_create(:name => t)
			#	comment.tags << tag
			#end
			
			comment.raise_on_save_failure = true
			comment.save
		end	
	end
	
	def find_conversations
		#comments=
	end

	def input	
		comments_json=Array.new
		issue_title = "Add colouring (and description) to password checker"
		issue = Issue.first(:title => issue_title)
		comments=Comment.all(:issue => issue)
		count=0
		comments.each do |curr|
			curr_json=Hash.new
			curr_json["title"]=comments[count].title
			curr_json["link"]=comments[count].link
			curr_json["author"]=comments[count].participant.user_name
			curr_json["authorLink"]=comments[count].participant.link
			curr_json["content"]=comments[count].content
			curr_json["tags"]=Array.new
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
		tmp_file = "#{Rails.root}/out.txt"
		File.open(tmp_file, 'wb') do |f|
			f.write issue
		end
		render :json => final_json.to_json
	end
end
