/**
* Input patch to correctly calculate mouse position
*/

ig.module(
    "plugins.patches.input-patch"
).requires(
	'impact.input'
).defines(function () {
    //inject
    ig.Input.inject({
    	mousemove: function( event ) { 
            // var internalWidth = parseInt(ig.system.canvas.offsetWidth) || ig.system.realWidth;
    		var internalWidth = ig.system.realWidth;
		
    		var scale = ig.system.scale * (internalWidth / ig.system.realWidth);
            
    		var pos = {left: 0, top: 0};
    		if( ig.system.canvas.getBoundingClientRect ) {
    			pos = ig.system.canvas.getBoundingClientRect();
    		}
		
    		var ev = event.touches ? event.touches[0] : event;
    		this.mouse.x = (ev.clientX - pos.left) / scale;
    		this.mouse.y = (ev.clientY - pos.top) / scale;
        }
    })
});
