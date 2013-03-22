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
		iss = Issue.first_or_create({:link => issue["link"]},{:title => issue["title"],:status =>issue["status"],:participant=>part})
		
			
		input.each do |curr|	
			part = Participant.first_or_create({:user_name =>curr["author"]},{:link=>curr["authorLink"]})
			comment = Comment.first_or_create(:title => curr["title"])
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

	def input
		#render :json => @data, :callback =>params[:callback]
		send_file(@@data,
  			:filename => "input",
  			:type => "application/json")
	end
end
