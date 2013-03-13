class SendjsonController < ApplicationController
	skip_before_filter :verify_authenticity_token
	#before_filter :cors_preflight_check
	#after_filter :cors_set_access_control_headers
	@@data = Rails.root.to_s+'/input.json'


	def input
		#render :json => @data, :callback =>params[:callback]
		send_file(@@data,
  			:filename => "input",
  			:type => "application/json")
	end

	def receive
		#render :json => @data, :callback =>params[:callback]
	end

	# For all responses in this controller, return the CORS access control headers.
	def cors_set_access_control_headers
	  headers['Access-Control-Allow-Origin'] = '*'
	  headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
	  headers['Access-Control-Max-Age'] = "1728000"
	end
	# If this is a preflight OPTIONS request, then short-circuit the
	# request, return only the necessary headers and return an empty
	# text/plain.
	def cors_preflight_check
	  if request.method == :options
	    headers['Access-Control-Allow-Origin'] = '*'
	    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
	    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-Prototype-Version'
	    headers['Access-Control-Max-Age'] = '1728000'
	    render :text => '', :content_type => 'text/plain'
	  end
	end

end
