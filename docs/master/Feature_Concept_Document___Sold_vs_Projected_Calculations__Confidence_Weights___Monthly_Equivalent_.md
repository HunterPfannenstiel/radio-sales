This feature defines the rules for how the product calculates Sold and Projected so reps, managers, and executives can see a consistent, coaching-friendly view of performance against goals. The intent is to keep the money metrics simple to interpret while still reflecting the reality of pipeline uncertainty and varying schedule lengths.

Sold is based only on closed business. An interaction contributes to Sold only when it is marked outcome = Yes. Each Yes is treated as its own Sold event and counts in the week and month it occurred, even if the same business has additional interactions later in the year.

Projected is a single forecasting number that represents where the rep is likely to land based on what is already sold plus the current pending pipeline. Projected includes Sold plus weighted Pending. For Sold (Yes), the system does not ask the rep for a confidence level. Instead, every Yes is treated as IN at 95% for the purpose of the Projected calculation. For Pending, the rep selects a confidence level from SURE, EXPECT, or HOPE, and the system applies fixed weights: SURE at 80%, EXPECT at 40%, and HOPE at 10%. Interactions marked outcome = No do not contribute to Projected.

Because broadcast marketing plans can be short-term or long-term (including annual buys), all money comparisons to monthly goals are normalized to a monthly equivalent value. When a rep enters an ask or sold amount, they also enter the term length as a number plus a selection of weeks or months. The system standardizes to months using a simple conversion of 4 weeks per month and keeps decimals (for example, 13 weeks becomes 3.25 months). The monthly equivalent value is used for Sold percent to monthly goal and Projected versus monthly goal, so a $15,000 annual buy contributes $1,250 per month rather than being counted all at once.

Interactions without an ask amount do not contribute any dollars to Sold or Projected, but they still count as activity for calls and stage progression. Edits to a business’s current stage or next step do not affect Sold or Projected calculations; only logged interactions with ask amounts and outcomes contribute to money totals.

Clarifications:

- When a sale is logged, its value should be distributed between the months in encompasses. This means that you can actively work towards a monthly goal that isn’t the current month.

- I assume we need to allow the user to enter start and end dates of the contract when logging - or at least a start date plus term length?

- If a contract starts in the middle of a month, should the amount contributed to the monthly goal be half of the contract’s monthly value?

- How granular do we want this, if the contract starts on the 5th of a month and the month has 30 days, should 83% (25/30) of the monthly value for the contract be applied to that month’s goal? Should we goes as granular as days or remain on the level of weeks, which in this case the 5th of a month is closer to the 2nd week than it is the 1st week so we would then apply 75% of the value to the month’s goal, instead of 100%