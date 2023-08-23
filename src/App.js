import React, { useState } from 'react';
import { Button, Container, CssBaseline, TextField, Typography, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  const [basePrompt, setBasePrompt] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputPrompts, setInputPrompts] = useState([]);
  const [generatedConfig, setGeneratedConfig] = useState('');
  const [stepCounts, setStepCounts] = useState([0.05, 0.05, 0.05]); // Initial step counts
  const step_titles = ["translation_x", "rotation_3d_y", "rotation_3d_z"]
  const modifyStepCount = (index, increment) => {
    setStepCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] = roundToDecimal(newCounts[index] + (increment ? 0.05 : -0.05), 2);
      return newCounts;
    });
  };

  const roundToDecimal = (number, decimalPlaces) => {
    const factor = 10 ** decimalPlaces;
    return Math.round(number * factor) / factor;
  };

  const handleBasePromptChange = (event) => {
    setBasePrompt(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const addPrompt = () => {
    if (inputText.trim() !== '') {
      setInputPrompts((prevPrompts) => [...prevPrompts, { text: inputText, isEditing: false }]);
      setInputText('');
    }
  };

  const toggleEditPrompt = (index) => {
    setInputPrompts((prevPrompts) =>
      prevPrompts.map((prompt, i) =>
        i === index ? { ...prompt, isEditing: !prompt.isEditing } : prompt
      )
    );
  };

  const updatePromptText = (index, newText) => {
    setInputPrompts((prevPrompts) =>
      prevPrompts.map((prompt, i) =>
        i === index ? { ...prompt, text: newText, isEditing: false } : prompt
      )
    );
  };

  const deletePrompt = (index) => {
    setInputPrompts((prevPrompts) => prevPrompts.filter((_, i) => i !== index));
  };

  const generateConfig = () => {
    

    const configContent = {
      basePrompt: basePrompt,
      prompts: inputPrompts.map((prompt) => prompt.text),
    };

    setGeneratedConfig(JSON.stringify(configContent, null, 2));
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuration Generator
      </Typography>

      {stepCounts.map((stepCount, index) => (
          <div key={index} style={{ marginTop: '20px' }}>
            <Typography variant="h6">Step Count {index + 1}</Typography>
            <Button variant="outlined" onClick={() => modifyStepCount(index, false)} sx={{ marginRight: '10px' }}>
              -
            </Button>
            <span>{stepCount}</span>
            <Button variant="outlined" onClick={() => modifyStepCount(index, true)} sx={{ marginLeft: '10px' }}>
              +
            </Button>
          </div>
        ))}


      <div>
        <TextField
          label="Enter base prompt"
          variant="outlined"
          multiline
          rows={4}
          value={basePrompt}
          onChange={handleBasePromptChange}
          sx={{ marginBottom: '20px', width: '100%' }}
        />
        <TextField
          label="Enter additional prompt"
          variant="outlined"
          multiline
          rows={4}
          value={inputText}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px', width: '100%' }}
        />

        <Button
          variant="contained"
          onClick={addPrompt}
          sx={{
            backgroundColor: '#007bff',
            color: '#fff',
            marginRight: '10px',
          }}
        >
          Add Prompt
        </Button>
        <Button
          variant="contained"
          onClick={generateConfig}
          sx={{ backgroundColor: '#007bff', color: '#fff' }}
        >
          Generate Config
        </Button>

        {inputPrompts.length > 0 && (
          <Typography variant="body1" sx={{ marginTop: '20px', fontSize: '18px' }}>
            Prompts:
            <ul>
              {inputPrompts.map((prompt, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  {prompt.isEditing ? (
                    <TextField
                      multiline   // Add multiline property
                      rows={4}     // Set the number of rows
                      value={prompt.text}
                      onChange={(e) => updatePromptText(index, e.target.value)}
                      onBlur={() => toggleEditPrompt(index)}
                      autoFocus
                      sx={{ minWidth: '300px', flex: 1 }} // Adjust width and flex as needed
                    />
                  ) : (
                    <span style={{ flex: 1 }}>{prompt.text}</span>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => toggleEditPrompt(index)}
                    sx={{ marginRight: '10px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => deletePrompt(index)}
                    sx={{ color: 'red' }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </Typography>
        )}
      </div>
      {generatedConfig && (
        <Typography variant="body1" sx={{ marginTop: '20px', fontSize: '18px' }}>
          Generated Config:
          <br />
          <code>{generatedConfig}</code>
        </Typography>
      )}
      {generatedConfig && (
        <Link
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            generatedConfig
          )}`}
          download="generated_config.json"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            marginTop: '20px',
            fontSize: '16px',
            textDecoration: 'none',
            color: '#007bff',
          }}
        >
          Download Config File
        </Link>
      )}
    </Container>
  </ThemeProvider>
  );
}

export default App;




let initConfigs = {
  "W": 768,
  "H": 1280,
  "show_info_on_ui": true,
  "tiling": false,
  "restore_faces": false,
  "seed_resize_from_w": 0,
  "seed_resize_from_h": 0,
  "seed": 2373535357,
  "sampler": "Euler a",
  "steps": 35,
  "batch_name": "Deforum_20230817134035",
  "seed_behavior": "iter",
  "seed_iter_N": 1,
  "use_init": false,
  "strength": 0.8,
  "strength_0_no_init": true,
  "init_image": null,
  "use_mask": false,
  "use_alpha_as_mask": false,
  "mask_file": "https://deforum.github.io/a1/M1.jpg",
  "invert_mask": false,
  "mask_contrast_adjust": 1.0,
  "mask_brightness_adjust": 1.0,
  "overlay_mask": true,
  "mask_overlay_blur": 4,
  "fill": 1,
  "full_res_mask": true,
  "full_res_mask_padding": 4,
  "reroll_blank_frames": "ignore",
  "reroll_patience": 10.0,
  "motion_preview_mode": false,
  "prompts": {
      "0": "     henry cavill as james bond, casino, key art, palm trees, highly detailed, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha,  (full body), (far from the camera) --neg deformed, disfigured, nsfw, nude     nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "140": "    Darth Vader wearing a Speedo at the beach, sharp focus, trending on ArtStation, masterpiece, by Greg Rutkowski, by Ross Tran, by Fenghua Zhong, octane, soft render, oil on canvas, colorful, cinematic, environmental concept art, (full body), (far from the camera)  --neg deformed, disfigured,  nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "210": "     henry cavill as james bond, casino, key art, palm trees, highly detailed, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha, (full body), (far from the camera)  --neg deformed, disfigured, nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "280": "     henry cavill as james bond, casino, key art, palm trees, highly detailed, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha, (full body), (far from the camera)  --neg deformed, disfigured, nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "350": "     henry cavill as james bond, casino, key art, palm trees, highly detailed, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha, (full body), (far from the camera) --neg deformed, disfigured, nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "420": "    greek god, gray hair, man, powerful, beautiful, ornate, beautiful, delicate, delicate, masterpiece, ice carving, hyperrealistic, cherry blossoms, water fractals, smooth, sharp focus, by caravaggio, artgerm and rembrandt and greg rutkowski and alphonse mucha,  (full body), (far from the camera), -- neg nsfw, nude  --neg nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "490": "     henry cavill as james bond, casino, key art, palm trees, highly detailed, artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha,  (full body), (far from the camera)  --neg deformed, disfigured, nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera",
      "560": "     henry cavill as james bond, casino, key art, palm trees, highly detailed,  artstation, concept art, cinematic lighting, sharp focus, illustration, by gaston bussiere alphonse mucha ,  (full body), (far from the camera) --neg deformed, disfigured, nsfw, nude    nsfw, nude  nsfw, nude, sunshine, shiny, naked, close to camera"
  },
  "positive_prompts": "",
  "negative_prompts": "nsfw, nude, sunshine, shiny, naked, close to camera",
  "animation_mode": "3D",
  "max_frames": 560,
  "border": "replicate",
  "angle": "0: (90), 25: (-90)",
  "zoom": "0:  (1.0025+0.002*sin(1.25*3.14*t/30))",
  "translation_x": "0: (-2),70: (2),140: (2),210: (-2), 280: (-2),350: (-2),420: (-2),490: (2)",
  "translation_y": "0: (0)",
  "translation_z": "0: (0)",
  "transform_center_x": "0: (2)",
  "transform_center_y": "0: (0)",
  "rotation_3d_x": "0: (0)",
  "rotation_3d_y": "0: (0.5),70: (-0.5),140: (-0.5),210: (0.5), 280: (0.5),350: (0.5),420: (0.5),490: (-0.5)",
  "rotation_3d_z": "0: (0.125), 70: (-0.125),140: (-0.125),210: (0.125), 280: (0.125), 350: (0.125),420: (0.125),490: (-0.125)",
  "enable_perspective_flip": false,
  "perspective_flip_theta": "0: (0)",
  "perspective_flip_phi": "0: (0)",
  "perspective_flip_gamma": "0: (12)",
  "perspective_flip_fv": "0: (53)",
  "noise_schedule": "0: (0.065)",
  "strength_schedule": "0: (0.75)",
  "contrast_schedule": "0: (1.0)",
  "cfg_scale_schedule": "0: (7)",
  "enable_steps_scheduling": false,
  "steps_schedule": "0: (25)",
  "fov_schedule": "0: (70)",
  "aspect_ratio_schedule": "0: (1)",
  "aspect_ratio_use_old_formula": false,
  "near_schedule": "0: (200)",
  "far_schedule": "0: (10000)",
  "seed_schedule": "0:(s), 1:(-1), \"max_f-2\":(-1), \"max_f-1\":(s)",
  "pix2pix_img_cfg_scale_schedule": "0:(1.5)",
  "enable_subseed_scheduling": false,
  "subseed_schedule": "0: (1)",
  "subseed_strength_schedule": "0: (0)",
  "enable_sampler_scheduling": false,
  "sampler_schedule": "0: (\"Euler a\")",
  "use_noise_mask": false,
  "mask_schedule": "0: (\"{video_mask}\")",
  "noise_mask_schedule": "0: (\"{video_mask}\")",
  "enable_checkpoint_scheduling": true,
  "checkpoint_schedule": "0: (\"realisticVisionV50_v50VAE.safetensors\"), 140: (\"revAnimated_v122.safetensors\"), 210: (\"realisticVisionV50_v50VAE.safetensors\"), 420: (\"realisticVisionV50_v50VAE.safetensors\"),  490: (\"realisticVisionV50_v50VAE.safetensors\")",
  "enable_clipskip_scheduling": false,
  "clipskip_schedule": "0: (2)",
  "enable_noise_multiplier_scheduling": true,
  "noise_multiplier_schedule": "0: (1.05)",
  "resume_from_timestring": false,
  "resume_timestring": "20230818135030",
  "enable_ddim_eta_scheduling": false,
  "ddim_eta_schedule": "0: (0)",
  "enable_ancestral_eta_scheduling": false,
  "ancestral_eta_schedule": "0: (1)",
  "amount_schedule": "0: (0.1)",
  "kernel_schedule": "0: (5)",
  "sigma_schedule": "0: (1)",
  "threshold_schedule": "0: (0)",
  "color_coherence": "LAB",
  "color_coherence_image_path": "",
  "color_coherence_video_every_N_frames": 1,
  "color_force_grayscale": false,
  "legacy_colormatch": false,
  "diffusion_cadence": 1,
  "optical_flow_cadence": "None",
  "cadence_flow_factor_schedule": "0: (1)",
  "optical_flow_redo_generation": "None",
  "redo_flow_factor_schedule": "0: (1)",
  "diffusion_redo": "0",
  "noise_type": "perlin",
  "perlin_octaves": 4,
  "perlin_persistence": 0.5,
  "use_depth_warping": true,
  "depth_algorithm": "Midas-3-Hybrid",
  "midas_weight": 0.2,
  "padding_mode": "border",
  "sampling_mode": "bicubic",
  "save_depth_maps": false,
  "video_init_path": "https://deforum.github.io/a1/V1.mp4",
  "extract_nth_frame": 1,
  "extract_from_frame": 0,
  "extract_to_frame": -1,
  "overwrite_extracted_frames": false,
  "use_mask_video": false,
  "video_mask_path": "https://deforum.github.io/a1/VM1.mp4",
  "hybrid_comp_alpha_schedule": "0:(0.5)",
  "hybrid_comp_mask_blend_alpha_schedule": "0:(0.5)",
  "hybrid_comp_mask_contrast_schedule": "0:(1)",
  "hybrid_comp_mask_auto_contrast_cutoff_high_schedule": "0:(100)",
  "hybrid_comp_mask_auto_contrast_cutoff_low_schedule": "0:(0)",
  "hybrid_flow_factor_schedule": "0:(1)",
  "hybrid_generate_inputframes": false,
  "hybrid_generate_human_masks": "None",
  "hybrid_use_first_frame_as_init_image": true,
  "hybrid_motion": "None",
  "hybrid_motion_use_prev_img": false,
  "hybrid_flow_consistency": false,
  "hybrid_consistency_blur": 2,
  "hybrid_flow_method": "RAFT",
  "hybrid_composite": "None",
  "hybrid_use_init_image": false,
  "hybrid_comp_mask_type": "None",
  "hybrid_comp_mask_inverse": false,
  "hybrid_comp_mask_equalize": "None",
  "hybrid_comp_mask_auto_contrast": false,
  "hybrid_comp_save_extra_frames": false,
  "parseq_manifest": "",
  "parseq_use_deltas": true,
  "use_looper": false,
  "init_images": "{\n    \"0\": \"https://deforum.github.io/a1/Gi1.png\",\n    \"max_f/4-5\": \"https://deforum.github.io/a1/Gi2.png\",\n    \"max_f/2-10\": \"https://deforum.github.io/a1/Gi3.png\",\n    \"3*max_f/4-15\": \"https://deforum.github.io/a1/Gi4.jpg\",\n    \"max_f-20\": \"https://deforum.github.io/a1/Gi1.png\"\n}",
  "image_strength_schedule": "0:(0.75)",
  "blendFactorMax": "0:(0.35)",
  "blendFactorSlope": "0:(0.25)",
  "tweening_frames_schedule": "0:(20)",
  "color_correction_factor": "0:(0.075)",
  "cn_1_overwrite_frames": true,
  "cn_1_vid_path": "",
  "cn_1_mask_vid_path": "",
  "cn_1_enabled": true,
  "cn_1_low_vram": false,
  "cn_1_pixel_perfect": true,
  "cn_1_module": "canny",
  "cn_1_model": "control_v11p_sd15_canny [d14c016b]",
  "cn_1_weight": "0:(1)",
  "cn_1_guidance_start": "0:(0.0)",
  "cn_1_guidance_end": "0:(1.0)",
  "cn_1_processor_res": 512,
  "cn_1_threshold_a": 100,
  "cn_1_threshold_b": 200,
  "cn_1_resize_mode": "Inner Fit (Scale to Fit)",
  "cn_1_control_mode": "My prompt is more important",
  "cn_1_loopback_mode": false,
  "cn_2_overwrite_frames": true,
  "cn_2_vid_path": "",
  "cn_2_mask_vid_path": "",
  "cn_2_enabled": true,
  "cn_2_low_vram": false,
  "cn_2_pixel_perfect": true,
  "cn_2_module": "lineart",
  "cn_2_model": "control_v11p_sd15_lineart [43d4be0d]",
  "cn_2_weight": "0:(1)",
  "cn_2_guidance_start": "0:(0.0)",
  "cn_2_guidance_end": "0:(1.0)",
  "cn_2_processor_res": 64,
  "cn_2_threshold_a": 64,
  "cn_2_threshold_b": 64,
  "cn_2_resize_mode": "Inner Fit (Scale to Fit)",
  "cn_2_control_mode": "My prompt is more important",
  "cn_2_loopback_mode": false,
  "cn_3_overwrite_frames": true,
  "cn_3_vid_path": "",
  "cn_3_mask_vid_path": "",
  "cn_3_enabled": false,
  "cn_3_low_vram": false,
  "cn_3_pixel_perfect": false,
  "cn_3_module": "none",
  "cn_3_model": "None",
  "cn_3_weight": "0:(1)",
  "cn_3_guidance_start": "0:(0.0)",
  "cn_3_guidance_end": "0:(1.0)",
  "cn_3_processor_res": 64,
  "cn_3_threshold_a": 64,
  "cn_3_threshold_b": 64,
  "cn_3_resize_mode": "Inner Fit (Scale to Fit)",
  "cn_3_control_mode": "Balanced",
  "cn_3_loopback_mode": false,
  "cn_4_overwrite_frames": true,
  "cn_4_vid_path": "",
  "cn_4_mask_vid_path": "",
  "cn_4_enabled": false,
  "cn_4_low_vram": false,
  "cn_4_pixel_perfect": false,
  "cn_4_module": "none",
  "cn_4_model": "None",
  "cn_4_weight": "0:(1)",
  "cn_4_guidance_start": "0:(0.0)",
  "cn_4_guidance_end": "0:(1.0)",
  "cn_4_processor_res": 64,
  "cn_4_threshold_a": 64,
  "cn_4_threshold_b": 64,
  "cn_4_resize_mode": "Inner Fit (Scale to Fit)",
  "cn_4_control_mode": "Balanced",
  "cn_4_loopback_mode": false,
  "cn_5_overwrite_frames": true,
  "cn_5_vid_path": "",
  "cn_5_mask_vid_path": "",
  "cn_5_enabled": false,
  "cn_5_low_vram": false,
  "cn_5_pixel_perfect": false,
  "cn_5_module": "none",
  "cn_5_model": "None",
  "cn_5_weight": "0:(1)",
  "cn_5_guidance_start": "0:(0.0)",
  "cn_5_guidance_end": "0:(1.0)",
  "cn_5_processor_res": 64,
  "cn_5_threshold_a": 64,
  "cn_5_threshold_b": 64,
  "cn_5_resize_mode": "Inner Fit (Scale to Fit)",
  "cn_5_control_mode": "Balanced",
  "cn_5_loopback_mode": false,
  "skip_video_creation": false,
  "fps": 25,
  "make_gif": false,
  "delete_imgs": false,
  "delete_input_frames": false,
  "add_soundtrack": "None",
  "soundtrack_path": "https://deforum.github.io/a1/A1.mp3",
  "r_upscale_video": false,
  "r_upscale_factor": "x2",
  "r_upscale_model": "realesr-animevideov3",
  "r_upscale_keep_imgs": true,
  "store_frames_in_ram": false,
  "frame_interpolation_engine": "None",
  "frame_interpolation_x_amount": 2,
  "frame_interpolation_slow_mo_enabled": false,
  "frame_interpolation_slow_mo_amount": 2,
  "frame_interpolation_keep_imgs": true,
  "frame_interpolation_use_upscaled": false,
  "sd_model_name": "dreamshaper_7.safetensors",
  "sd_model_hash": "5cf5ae06",
  "deforum_git_commit_id": "0949bf42"
}