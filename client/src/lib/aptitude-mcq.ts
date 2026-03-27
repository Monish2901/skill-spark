import { type SampleQuestion } from "./sample-questions";

const q = (question_text: string, correct: string, wrong1: string, wrong2: string, wrong3: string): SampleQuestion => ({
  question_text,
  options: [
    { text: correct, is_correct: true },
    { text: wrong1, is_correct: false },
    { text: wrong2, is_correct: false },
    { text: wrong3, is_correct: false },
  ].sort(() => Math.random() - 0.5),
  marks: 1,
});

export const aptitudeL1: SampleQuestion[] = [
  // Number System
  q("What is the unit digit in the product (365 x 659 x 771)?", "5", "0", "1", "7"),
  q("The sum of first N natural numbers is denoted by?", "N(N+1)/2", "N/2(N-1)", "N^2 + 1", "(N+1)/2"),
  q("The largest 4 digit number exactly divisible by 88 is?", "9944", "9988", "9844", "9768"),
  q("What is the smallest prime number?", "2", "1", "0", "3"),
  
  // Ratio Proportion
  q("If A:B = 2:3 and B:C = 4:5, then A:B:C is?", "8:12:15", "2:3:5", "8:15:20", "4:6:10"),
  q("The ratio of ages of two students is 3:2. One is older to the other by 5 years. What is the age of the younger student?", "10 years", "15 years", "2 years", "5 years"),
  q("Two numbers are respectively 20% and 50% more than a third number. The ratio of the two numbers is?", "4:5", "2:5", "3:5", "5:4"),
  q("Find the fourth proportional to 4, 9, 12.", "27", "21", "24", "36"),
  
  // Alligation & Mixtures
  q("In an alloy, zinc and copper are in the ratio of 1:2. In another alloy, these are 2:3. If mixed to form a new alloy with 5:8, the ratio is:", "3:10", "10:3", "7:11", "11:7"),
  q("In what ratio must water be mixed with milk to gain 16.66% by selling at cost price?", "1:6", "1:5", "2:5", "2:3"),
  q("A mixture of 150 liters of wine and water contains 20% water. How much more water should be added to make it 25% water?", "10 liters", "15 liters", "20 liters", "5 liters"),
  q("Find ratio of quantities of tea at Rs. 62/kg and Rs. 72/kg to make mixture worth Rs. 64.50/kg.", "3:1", "1:3", "2:3", "3:2"),
  
  // Partnership
  q("A, B, and C enter into a partnership. A invests 3 times as B and B invests 2/3 of C. If profit is Rs. 6600, share of B is?", "Rs. 1200", "Rs. 2400", "Rs. 1800", "Rs. 3600"),
  q("A started a business investing Rs. 70,000. B joined after 6 months with Rs. 1,05,000. Ratio of profits after 1 year is?", "4:3", "3:4", "2:3", "1:1"),
  q("A and B invest in a business in ratio 3:2. If 5% of profit to charity and A's share is Rs. 855, total profit is?", "Rs. 1500", "Rs. 1400", "Rs. 1600", "Rs. 1800"),
  q("C enters into a partnership with Rs. 50,000 for 12 months. D enters with Rs. 60,000 for 8 months. Profit ratio C:D is?", "5:4", "4:5", "3:2", "5:6"),
  
  // Percentage
  q("A student multiplied a number by 3/5 instead of 5/3. What is the percentage error?", "64%", "34%", "44%", "54%"),
  q("If 20% of a = b, then b% of 20 is the same as:", "4% of a", "5% of a", "20% of a", "None of these"),
  q("If the price of a book is first decreased by 25% and then increased by 20%, the net change is?", "10% decrease", "5% decrease", "No change", "5% increase"),
  q("30% of 140 = x% of 840, find x.", "5", "15", "10", "20"),
  
  // Profit Loss
  q("A sells an article at a loss of 8%. If sold for Rs. 36 more, he'd gain 10%. The cost price is:", "Rs. 200", "Rs. 150", "Rs. 180", "Rs. 240"),
  q("A man buys a cycle for Rs. 1400 and sells it at a loss of 15%. What is the selling price?", "Rs. 1190", "Rs. 1202", "Rs. 1160", "Rs. 1000"),
  q("A trader marks his goods at 20% above the cost price and allows a discount of 10%. His gain percentage is:", "8%", "10%", "12%", "6%"),
  q("If the cost price of 12 pens is equal to the selling price of 8 pens, the gain percent is?", "50%", "33.3%", "25%", "66.6%"),
  
  // Ages & Calendar
  q("The sum of ages of 5 children born at intervals of 3 years each is 50. Age of youngest child is?", "4 years", "8 years", "10 years", "None of these"),
  q("A father said to his son, 'I was as old as you are at present at the time of your birth'. If father's age is 38 years now, son's age 5 years back was?", "14 years", "19 years", "33 years", "38 years"),
  q("What was the day of the week on 15th August 1947?", "Friday", "Thursday", "Wednesday", "Saturday"),
  q("Today is Monday. After 61 days, it will be:", "Saturday", "Sunday", "Tuesday", "Thursday"),
  
  // Clocks & Directions
  q("A clock is set right at 5 a.m. It loses 16 min in 24 hours. True time when clock shows 10 p.m. on 4th day?", "11 p.m.", "10 p.m.", "9 p.m.", "8 p.m."),
  q("How many times do the hands of a clock coincide in a day?", "22", "24", "20", "21"),
  q("A man faces East. Turns 100 deg clockwise, 145 deg anticlockwise. Direction now?", "North-East", "North", "South-West", "East"),
  q("Rohan walks 10 km towards North, 6 km South, then 3 km East. How far and which direction from start?", "5 km North-East", "7 km North-West", "5 km South-East", "7 km East")
];

export const aptitudeL2: SampleQuestion[] = [
  // Time & Work
  q("A can do a work in 15 days, B in 20 days. Work together for 4 days, fraction of work left is?", "8/15", "7/15", "1/4", "1/10"),
  q("A is twice as good a workman as B and together they finish in 18 days. In how many days can A alone finish?", "27 days", "54 days", "36 days", "18 days"),
  q("If 6 men and 8 boys can do a piece of work in 10 days while 26 men and 48 boys can do the same in 2 days, the time taken by 15 men and 20 boys is?", "4 days", "10 days", "5 days", "7 days"),
  q("A, B, C can do a work in 20, 30, and 60 days. A works, assisted by B and C every third day. How many days?", "15 days", "12 days", "10 days", "18 days"),
  q("A can lay railway track between two given stations in 16 days and B can do the same in 12 days. With help of C, they did the job in 4 days. C alone could do it in?", "9 3/5 days", "9 1/5 days", "10 days", "8 days"),
  
  // Pipes & Cisterns
  q("Pipes A and B can fill a tank in 20 and 30 min. If both are used together, time to fill is?", "12 minutes", "15 minutes", "25 minutes", "50 minutes"),
  q("A pump can fill a tank with water in 2 hours. Because of a leak, it took 2 1/3 hours to fill the tank. The leak can drain all the water of the tank in:", "14 hours", "8 hours", "10 hours", "12 hours"),
  q("Two pipes A and B can fill a tank in 15 minutes and 20 minutes respectively. Both the pipes are opened together but after 4 minutes, pipe A is turned off. What is the total time required to fill the tank?", "14 min. 40 sec.", "11 min. 45 sec.", "12 min. 30 sec.", "15 min."),
  q("A cistern is normally filled in 8 hours but takes another 2 hours longer to fill because of a leak in its bottom. If the cistern is full, the leak will empty it in:", "40 hours", "16 hours", "20 hours", "25 hours"),
  q("Two pipes can fill a tank in 10 hours and 12 hours respectively while a third, pipe empties the full tank in 20 hours. If all the three pipes operate simultaneously, in how much time will the tank be filled?", "7 hours 30 min", "7 hours", "8 hours", "8 hours 30 min"),
  
  // Averages
  q("The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?", "19", "0", "1", "10"),
  q("The average weight of 8 person's increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What might be the weight of the new person?", "85 kg", "76 kg", "80 kg", "70 kg"),
  q("The captain of a cricket team of 11 members is 26 years old and the wicket keeper is 3 years older. If the ages of these two are excluded, the average age of the remaining players is one year less than the average age of the whole team. What is the average age of the team?", "23 years", "24 years", "25 years", "20 years"),
  q("The average of first 50 natural numbers is?", "25.5", "25", "26", "26.5"),
  
  // SI and CI
  q("Difference between SI and CI on Rs. 4000 for 2 years at 5% p.a.?", "Rs. 10", "Rs. 20", "Rs. 40", "Rs. 5"),
  q("Simple interest on a certain sum is 16/25 of the sum. Find the rate percent and time, if both are numerically equal.", "8% and 8 years", "6% and 6 years", "10% and 10 years", "5% and 5 years"),
  q("The compound interest on Rs. 30,000 at 7% per annum is Rs. 4347. The period (in years) is:", "2", "3", "4", "2.5"),
  q("What will be the ratio of simple interest earned by certain amount at the same rate of interest for 6 years and that for 9 years?", "2:3", "1:3", "3:2", "4:5"),
  
  // Time Speed Distance
  q("A person crosses a 600m long street in 5 mins. His speed in km/hr is?", "7.2 km/hr", "3.6 km/hr", "8.4 km/hr", "10 km/hr"),
  q("An aeroplane covers a certain distance at a speed of 240 kmph in 5 hours. To cover the same distance in 1 2/3 hours, it must travel at a speed of:", "720 kmph", "600 kmph", "300 kmph", "500 kmph"),
  q("A man walking at the rate of 5 km/hr crosses a bridge in 15 minutes. The length of the bridge (in metres) is:", "1250", "1000", "600", "750"),
  q("A boy goes to school at a speed of 3 km/hr and returns to the village at a speed of 2 km/hr. If he takes 5 hours in all, what is the distance?", "6 km", "5 km", "7 km", "8 km"),
  
  // Problems on Trains
  q("A train 125m long passes a man, running at 5 km/hr in the same direction, in 10s. Speed of train is?", "50 km/hr", "54 km/hr", "45 km/hr", "55 km/hr"),
  q("Two trains running in opposite directions cross a man standing on the platform in 27 seconds and 17 seconds respectively and they cross each other in 23 seconds. The ratio of their speeds is:", "3:2", "1:3", "3:1", "2:3"),
  q("A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", "150 metres", "120 metres", "180 metres", "324 metres"),
  q("The length of the bridge, which a train 130 metres long and travelling at 45 km/hr can cross in 30 seconds, is:", "245 m", "200 m", "250 m", "220 m"),
  
  // Boats and Streams
  q("A man's speed with current is 15 km/hr, current speed is 2.5 km/hr. Speed against current?", "10 km/hr", "12.5 km/hr", "8.5 km/hr", "9 km/hr"),
  q("A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.", "4 hours", "2 hours", "3 hours", "5 hours"),
  q("A motorboat, whose speed in 15 km/hr in still water goes 30 km downstream and comes back in a total of 4 hours 30 minutes. The speed of the stream (in km/hr) is:", "5", "6", "4", "10"),
  q("A man can row at 5 kmph in still water. If the velocity of current is 1 kmph and it takes him 1 hour to row to a place and come back, how far is the place?", "2.4 km", "3.0 km", "2.5 km", "3.6 km")
];

export const aptitudeL3: SampleQuestion[] = [
  // Permutation & Combination
  q("In how many different ways can the letters of the word 'MATHEMATICS' be arranged?", "4989600", "10080", "1209600", "11! / 2!"),
  q("In how many ways can 5 boys and 3 girls sit in a row so that no two girls are together?", "14400", "2880", "720", "5040"),
  q("How many 3-digit numbers can be formed from the digits 2, 3, 5, 6, 7 and 9, which are divisible by 5 and none of the digits is repeated?", "20", "5", "15", "25"),
  q("In a group of 6 boys and 4 girls, four children are to be selected. In how many different ways can they be selected such that at least one boy should be there?", "209", "159", "194", "205"),
  q("In how many ways can a committee of 5 be formed from 6 men and 4 women?", "252", "200", "300", "350"),
  
  // Probability
  q("Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?", "3/4", "1/4", "1/2", "5/8"),
  q("A card is drawn from a well shuffled pack of 52 cards. Probability of it being a spade or a king?", "4/13", "1/4", "1/13", "5/13"),
  q("In a lottery, there are 10 prizes and 25 blanks. A lottery is drawn at random. What is the probability of getting a prize?", "2/7", "5/7", "1/10", "2/5"),
  q("Two unbiased coins are tossed. What is the probability of getting at most one head?", "3/4", "1/2", "1/4", "1/3"),
  q("A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?", "10/21", "11/21", "2/7", "5/7"),
  
  // Square and Cubic Roots
  q("Evaluate: √(110.25) + ∛(1728)", "22.5", "23.5", "21.5", "24.5"),
  q("What is the square root of 0.00000441?", "0.0021", "0.021", "0.00021", "0.21"),
  q("If √x ÷ √441 = 0.02, then value of x is:", "0.1764", "1.764", "1.64", "0.01764"),
  q("The cube root of .000216 is:", ".06", ".6", ".006", "6"),
  q("If x = ∛(2^4 × 2^5), then x is:", "8", "4", "16", "32"),
  
  // Logarithm
  q("If log 2 = 0.3010 and log 3 = 0.4771, calculate the value of log 512.", "2.709", "2.870", "2.967", "3.010"),
  q("Evaluate: log_5 (125)", "3", "4", "5", "25"),
  q("If log(x) + log(y) = log(x+y), then:", "y = x/(x-1)", "x = y", "x * y = 1", "y = x/(x+1)"),
  q("If log_10(2) = 0.3010, the value of log_10(80) is:", "1.9030", "1.6020", "3.9030", "2.9030"),
  q("If log a = 1/2 log b = 1/5 log c, then a^4 * b^3 * c^-2 = ?", "1", "0", "10", "abc"),
  
  // Stocks and Shares
  q("A man buys Rs. 20 shares paying 9% dividend. The man wants to have an interest of 12% on his money. The market value of each share is:", "Rs. 15", "Rs. 18", "Rs. 12", "Rs. 21"),
  q("In order to obtain an income of Rs. 650 from 10% stock at Rs. 96, one must make an investment of:", "Rs. 6240", "Rs. 6500", "Rs. 6000", "Rs. 5000"),
  q("By investing Rs. 1620 in 8% stock, Michael earns Rs. 135. The stock is then quoted at:", "Rs. 96", "Rs. 108", "Rs. 80", "Rs. 106"),
  q("At what price should a 6% Rs. 100 share be quoted when the money is worth 5%?", "Rs. 120", "Rs. 105", "Rs. 110", "Rs. 115"),
  q("A 10% stock yielding 12% is quoted at:", "Rs. 83.33", "Rs. 80", "Rs. 120", "Rs. 100"),
  
  // Bankers Discount
  q("Calculate the exact banker's discount on a bill of Rs. 10,200 due 4 months hence at 15% per annum.", "Rs. 510", "Rs. 450", "Rs. 600", "Rs. 500"),
  q("The banker's discount on a bill due 4 months hence at 15% is Rs. 420. The true discount is:", "Rs. 400", "Rs. 360", "Rs. 380", "Rs. 410"),
  q("The banker's discount of a certain sum of money is Rs. 72 and the true discount on the same sum for the same time is Rs. 60. The sum due is:", "Rs. 360", "Rs. 432", "Rs. 1080", "Rs. 540"),
  q("The true discount on a bill is Rs. 1800 and banker's discount is Rs. 1887. If bill is due 10 months hence, rate of interest is:", "5.8%", "10%", "8%", "12%"),
  q("The present worth of a sum due sometime hence is Rs. 576 and the banker's gain is Rs. 16. The true discount is:", "Rs. 96", "Rs. 72", "Rs. 112", "Rs. 100")
];
