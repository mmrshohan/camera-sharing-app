import type { ComponentMeta } from "@workspace/types";

export const meta: ComponentMeta = {
  id: "text-field",
  name: "TextField",
  group: 2,
  layer: "system",
  status: "review",
  version: "1.0.0",
  summary:
    "One line of text, such as a username. The brand field on iOS; Material's outlined field on Android.",
  anatomy: [
    "iOS: the label above; a 50 pt field, radius 12, 1 pt fieldBorder, a 2 pt accent ring while typing",
    "Android: a 56 dp outlined field, radius 4; the label sits inside and floats onto the outline",
    "An optional prefix, such as @ for usernames",
    "Below, one status line with an icon and words: checking, valid or invalid",
    "Invalid turns the outline and the words danger",
  ],
  tokens: [
    "system.fieldHeight",
    "system.fieldRadius",
    "color.fieldBorder",
    "color.accent",
    "color.danger",
    "color.success",
    "color.ink2",
    "color.ink3",
    "type.body",
    "type.subheadline",
    "type.footnote",
    "shape.iconChip",
    "motion.waiting",
  ],
  states: ["idle", "checking", "valid", "invalid"],
  accessibility: [
    "A real label element names the input",
    "Invalid sets aria-invalid; the status line is linked by aria-describedby and sits in a polite live region, so each change is announced once",
    "Status never relies on color: an icon and words, always",
    "The outline passes 3:1 against the background in both themes (tested pair)",
  ],
  motion: [
    "Android: the label floats over 200 ms; with Reduce Motion it moves at once",
    "Checking shows the turning arc, still with Reduce Motion",
  ],
  native: {
    ios: "TextField(label, text:) with a custom style: RoundedRectangle(cornerRadius: system.fieldRadius) stroked with fieldBorder, 2 pt accent when focused (@FocusState); Text(prefix) leading; the status line below; .textInputAutocapitalization(.never), .autocorrectionDisabled(), .submitLabel(.go)",
    android:
      'OutlinedTextField(value, onValueChange, label = { Text(label) }, prefix = { Text("@") }, isError, supportingText = { status line }, singleLine = true) with outline colors from tokens; KeyboardOptions(autoCorrectEnabled = false, imeAction = ImeAction.Go)',
    status: { ios: "not-started", android: "not-started" },
  },
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-29",
      summary: "First version: idle, checking, valid and invalid.",
    },
  ],
};
