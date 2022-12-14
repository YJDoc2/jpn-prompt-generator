# Data Scheme

This defines the data scheme that is used by this project.

## Raw

This is the scheme used to verify the uploaded data, and stored with the `raw`
key in localStorage.

### Vocab sets

```json
{
  "title": "string", // title of the set, will be used to denote the set in UI
  "meta": "Object", // stuff for internal use
  "data": [
    {
      "text": "string", // The text to be displayed, i.e. the actual vocab
      "jishoLink": "string", // Optional , link for jisho of that word, if not present, default will be https://jisho.org/search/`word`
      "attribution": "Object" // attribution information from jisho, not yet used
    }
  ]
}
```

### Grammar sets

```json
{
  "title": "string", // title of the set, will be used to denote the set in UI
  "data": [
    {
      "title": "string", // the title to be shown in UI for this subset
      "meta": "Object", // stuff for internal use
      "points": [
        { // if the point is of string type, it will be considered as the text, and the links section will be empty array
          "text": "string", //  the text to be shown, i.e. the  actual grammar point
          "links": [ // optional
            {
              "title": "string", // title of the link
              "url": "string" // href of the link
            }
          ]
        }
      ]
    }
  ]
}
```

## Scheme for data upload ( Adding custom sets )

This specifies the data scheme of the json file that needs to be uploaded for
custom sets.

### Vocab set

```json
[
  {
    "text": "string", // The text to be displayed, i.e. the actual vocab
    "jishoLink": "string", // Optional , link for jisho of that word, if not present, default will be https://jisho.org/search/`word`
    "attribution": "Object" // attribution information from jisho, not yet used
  }
]
```

### Grammar set

```json
[
  {
    "title": "string", // the title to be shown in UI for this subset
    "points": [
      { // if the point is of string type, it will be considered as the text, and the links section will be empty array
        "text": "string", //  the text to be shown, i.e. the  actual grammar point
        "links": [ // optional
          {
            "title": "string", // title of the link
            "url": "string" // href of the link
          }
        ]
      }
    ]
  }
]
```
