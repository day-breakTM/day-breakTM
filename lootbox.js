// Function to create the spinning wheel
function createSpinningWheel(segments) {
    const canvas = document.getElementById('spinning-wheel');
    const ctx = canvas.getContext('2d');
    const wheelRadius = 333;
    const segmentColors = ['#FF3E4D', '#FF974E', '#FFC94E', '#4EFF5A', '#5AD8FF', '#B07FFF', '#C495B5', '#F98CF2', '#9CF88D', '#238AA6', '#299558', '#5D15B5', '#ECAD5C', '#A226DF'];
  
    // Easing function
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  
    // Function to draw a wheel segment
    function drawSegment(startAngle, endAngle, text, color, isLanded, callback) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(wheelRadius, wheelRadius);
      ctx.arc(wheelRadius, wheelRadius, wheelRadius - 10, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
  
      if (isLanded) {
        let landedColor = color;
        if (callback) {
          callback(landedColor);
        }
      }
      if (isLanded) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
  
      const segmentAngle = (startAngle + endAngle) / 2;
    
      ctx.save();
      ctx.translate(wheelRadius, wheelRadius);
      ctx.rotate(segmentAngle);
    
      ctx.restore();
      ctx.restore();
    }
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Calculate total percentage
    const totalPercentage = segments.reduce((total, segment) => total + segment.percentage, 0);
  
    // Draw the wheel segments
    const segmentAngle = (Math.PI * 2) / segments.length;
    let angle = 0;
  
    segments.forEach((segment, index) => {
      const segmentText = {
        name: segment.name,
        percentage: segment.percentage.toFixed(1),
      };
      const segmentColor = segmentColors[index % segmentColors.length];
      const startAngle = angle;
      const endAngle = angle + segmentAngle;
      drawSegment(startAngle, endAngle, segmentText, segmentColor, false);
      angle += segmentAngle;
    });
  
    // Function to spin the wheel and output the landed segment
    function spinWheel() {
      const spinCount = 1; // Number of spins
      const spinDuration = 1500; // Duration of the spin in milliseconds
      const spinStart = Date.now();
  
      const weights = segments.map(segment => segment.percentage); // Create an array of segment weights
  
      function animate() {
        const elapsed = Date.now() - spinStart;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easedProgress = easeOut(progress);
        const rotation = (easedProgress * Math.PI * 2) % (Math.PI * 2);
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        segments.forEach((segment, index) => {
          const segmentText = {
            name: segment.name,
            percentage: segment.percentage.toFixed(1),
          };
          const segmentColor = segmentColors[index % segmentColors.length];
          const segmentRotation = rotation + segmentAngle * index;
          drawSegment(segmentRotation, segmentRotation + segmentAngle, segmentText, segmentColor, false);
        });
  
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Weighted random selection
          const cumulativeWeights = [];
          let cumulativeSum = 0;
          weights.forEach(weight => {
            cumulativeSum += weight;
            cumulativeWeights.push(cumulativeSum);
          });
  
          const randomNumber = Math.random() * cumulativeSum;
          const landedSegmentIndex = cumulativeWeights.findIndex(
            cumulativeWeight => randomNumber < cumulativeWeight
          );
          const landedSegment = segments[landedSegmentIndex];
          let landedColor = segmentColors[landedSegmentIndex % segmentColors.length];
  
          // Draw the landed segment with a black border
          const landedSegmentStartAngle = rotation + segmentAngle * landedSegmentIndex;
          const landedSegmentEndAngle = landedSegmentStartAngle + segmentAngle;
          drawSegment(
            landedSegmentStartAngle,
            landedSegmentEndAngle,
            {
              name: landedSegment.name,
              percentage: landedSegment.percentage.toFixed(1),
            },
            segmentColors[landedSegmentIndex % segmentColors.length],
            true,
            color => {
              landedColor = color; // Update the landed color
            }
          );
  
          console.log('The wheel landed on:', landedSegment.name);
  
          // Display color and segment information to the left of the wheel
          const legendX = wheelRadius + 500; // Adjust the X position based on your layout
          const legendY = wheelRadius + 10; // Adjust the Y position based on your layout
  
          ctx.fillStyle = '#000000'; // Set the text color to black
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
  
          ctx.fillText(landedSegment.name, legendX, legendY);
          ctx.fillStyle = landedColor;
          ctx.fillRect(legendX - 30, legendY - 7, 20, 14);
        }
      }
  
      animate();
    }
  
    // Return the spinWheel function to make it accessible outside of createSpinningWheel
    return spinWheel;
  }
  
  // Example usage with segments defined
  const segments = [
    { name: 'None', percentage: 25 },
    { name: 'Enhanced Senses', percentage: 10 },
    { name: 'Enhanced Physicality (Overall)', percentage: 10 },
    { name: 'Enhanced Physical Trait', percentage: 10 },
    { name: 'Immense Physicality Trait', percentage: 7 },
    { name: 'Monstrous Physicality', percentage: 7 },
    { name: 'Prodigy', percentage: 7 },
    { name: 'Platinum Tongue', percentage: 9 },
    { name: 'Win Condition', percentage: 7 },
    { name: 'Plus Ultra', percentage: 7 },
    { name: 'Eidetic Memory', percentage: 3 },
    { name: 'Untraceable', percentage: 7  },
    { name: 'Aura of Fear (II)', percentage: 5 },
    { name: 'Custom Trait', percentage: 2 },
    { name: 'Transcendent Transformation', percentage: 2 },
    { name: 'Last Act', percentage: 5 },
  ];
  
  // Create the spinning wheel and obtain the spinWheel function
  const spinWheel = createSpinningWheel(segments);
  
  // Call the spinWheel function to spin the wheel
  spinWheel();
  
