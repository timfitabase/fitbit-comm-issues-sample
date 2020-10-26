function settingsComponent(props: any) {
  let screenWidth = props.settingsStorage.getItem("screenWidth");
  let screenHeight = props.settingsStorage.getItem("screenHeight");
  return (
    <Page>
      <Section title={<Text bold align="left">Setup</Text>}>
        <TextInput label="Test Input" settingsKey="testInput" />      
      </Section>
      <ImagePicker
          title="Background Image"
          description="Pick an image to use as your background."
          label="Pick a Background Image"
          sublabel="Background image picker"
          settingsKey="backgroundImage"
          imageWidth={ screenWidth }
          imageHeight={ screenHeight }
      />
    </Page>
  );
}

registerSettingsPage(settingsComponent);
