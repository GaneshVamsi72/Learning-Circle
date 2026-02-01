---

# 🐞 Bug Log: Progress Update Validation Error

## 📌 Bug Title

**Progress Update Fails Incorrectly for Values Like 3/20, 4/20**

---

## 📅 Date

Feb 1 2026

---

## 🧩 Context

This bug occurred while updating user progress.

The application allows users to update progress in the format:

```
completedUnits / totalUnits
```

Example:

* 1 / 20
* 2 / 20
* 3 / 20

---

## ❌ Observed Behavior (Bug)

1 / 20 is fine

2 / 20 is fine

3 / 20 is not fine

.

.

.

.

* Error shown:

```
  Completed units exceed total
  ```

---

## ✅ Expected Behavior

* Any value where

```
  completedUnits <= totalUnits
  ```

  should be accepted

  Examples:

* 3 / 20 → valid
* 4 / 20 → valid
* 21 / 20 → invalid

  ---

  ## 🔍 Root Cause Analysis

  ### 1️⃣ HTML Form Submission

  Even though the input field was:

  ```html
  <input type="number">
  ```

  **HTML forms always send data as strings**.

  So the backend received:

  ```js
  {
    completedUnits: "3",
    totalUnits: "20"
  }
  ```

  ---

  ### 2️⃣ Joi Validation Behavior

* Joi **successfully validated** the values
* Joi **internally converted** strings to numbers
* BUT the validated \& converted data (`value`) was **not assigned back** to `req.body`

  So after validation:

  ```js
  req.body.progress.completedUnits === "3"   // still string
  req.body.progress.totalUnits === "20"      // still string
  ```

  ---

  ### 3️⃣ Route Logic Error

  The route contained this check:

  ```js
  if (updateProgress.totalUnits < updateProgress.completedUnits)
    throw new Error("Completed units exceed total");
  ```

  Because both values were strings, JavaScript performed **string comparison**:

  ```js
  "20" < "3"   // true (lexicographical comparison) -> The Cause of this Bug !!!!!!
  ```

  This caused valid values like `3 / 20` to fail.

  ---

  ### 4️⃣ Why Database Validation Did Not Help

* Mongoose validation runs **only when saving**
* The error was thrown **before** the database update
* So database validators never executed

  ---

  ## 🛠️ The Fix

  ### ✅ Correct Solution

  Normalize request data **after Joi validation** by replacing `req.body` with the validated value.

  #### Validation Middleware (Final Fix)

  ```js
  const { value, error } = progressSchema.validate(req.body, {
    convert: true,
    abortEarly: false
  });

  if (error) {
    throw new AppError(error.details.map(e => e.message).join(', '), 400);
  }

  req.body = value;   // 🔥 critical fix
  next();
  ```

  After this:

* Numbers are real numbers
* Route logic works correctly
* No string comparison bugs

  ---

  ## 🧠 Key Learnings

  ### 🔑 1. HTML Forms

* `<input type="number">` is **only for UI**
* Backend **always receives strings**

  ---

  ### 🔑 2. Joi Validation

* Joi **validates and converts internally**
* Joi **does NOT mutate `req.body`**
* Developers must explicitly apply:

  ```js
    req.body = value;
    ```

  ---

  ### 🔑 3. JavaScript Comparison Trap

* String comparisons can give wrong results:

  ```js
    "20" < "3"  // true
    ```

* Always ensure correct data types before logic

  ---

  ### 🔑 4. Database Validation Role

* Database validation:

  * protects data integrity
  * runs at save time

* It does **not** protect route logic

  ---

  ### 🔑 5. Correct Backend Rule (Golden Rule)

  > \*\*Validate + normalize input ONCE, early in the request lifecycle.\*\*

  ---

  ## ✅ Final Outcome

* Progress update bug fixed permanently
* Request data is now normalized
* Application logic is stable and predictable
* Future bugs of this type are prevented

  ---

  ## 🧾 Personal Note

  This bug was not trivial.
  It exposed how **HTML forms, request parsing, validation, route logic, and database layers interact**.

  

  🔥 The FULL truth in one picture

  FORM (strings)

  &nbsp; ↓

  Body parser (strings → object)

  &nbsp; ↓

  Joi (validate + convert internally)

  &nbsp; ↓

  YOU APPLY value → normalized req.body

  &nbsp; ↓

  Route logic (safe)

  &nbsp; ↓

  Mongoose (casts again, validates, saves)

  

  Understanding this greatly improved backend design awareness.

  ---